import { categoryAliasesReverse } from './constants';

/**
 * Extract strategy ID from the metric string (MUV4 format).
 * @param {string} metric - The metric string.
 * @returns {string|null} - The corresponding strategy ID or null if not found.
 */
export function getStrategyIdFromMetric(metric) {
  const parts = metric.split('/');
  const metricSuffix = parts[1];

  // If the metric format is unexpected, log an error and return null.
  if (!metricSuffix) {
    console.error(`Unexpected metric format: ${metric}`);
    return null;
  }

  // Map metric suffix to strategyId according to MUV4.
  switch (metricSuffix) {
    case 'Base64': return 'base64';
    case 'BestOfN': return 'best-of-n';
    case 'Citation': return 'citation';
    case 'Crescendo': return 'crescendo';
    case 'GCG': return 'gcg';
    case 'GOAT': return 'goat';
    case 'Injection': return 'prompt-injection';
    case 'Iterative': return 'jailbreak';
    case 'Composite': return 'jailbreak:composite';
    case 'Likert': return 'jailbreak:likert';
    case 'IterativeTree': return 'jailbreak:tree';
    case 'Leetspeak': return 'leetspeak';
    case 'MathPrompt': return 'math-prompt';
    case 'Multilingual': return 'multilingual';
    case 'Rot13': return 'rot13';
    case 'Pandamonium': return 'pandamonium';
    default:
      console.warn(`Unrecognized strategy for metric: ${metric}`);
      return null;
  }
}

/**
 * Extract strategy ID from the grading result in MUV4 format.
 * @param {Object} gradingResult - The grading result object.
 * @returns {string|null} - The strategy ID or null if not found.
 */
export function getStrategyIdFromGradingResult(gradingResult) {
  // Ensure that componentResults exists and is an array before processing.
  if (!gradingResult?.componentResults || !Array.isArray(gradingResult.componentResults)) {
    console.warn('Grading result is malformed or componentResults is missing.');
    return null;
  }

  // Iterate over the component results and extract strategy ID based on the metric.
  for (const result of gradingResult.componentResults) {
    if (result?.assertion?.metric) {
      const strategyId = getStrategyIdFromMetric(result.assertion.metric);
      if (strategyId) {
        return strategyId; // Return the first strategy found.
      }
    }
  }

  console.warn('No strategyId found in grading result.');
  return null;
}

/**
 * Extract plugin ID from the result based on the `harmCategory` or metric name.
 * @param {Object} result - The evaluation result.
 * @returns {string|null} - The plugin ID or null if not found.
 */
export function getPluginIdFromResult(result) {
  // Check if harmCategory exists in the result variables and return its corresponding plugin ID.
  const harmCategory = result?.vars?.['harmCategory'];
  if (harmCategory) {
    return categoryAliasesReverse[harmCategory] || null;
  }

  // Fallback: Check the componentResults for metric names and extract plugin ID from base metric name.
  const metricNames = result?.gradingResult?.componentResults?.map((r) => r?.assertion?.metric) || [];
  const metricBaseName = metricNames[0]?.split('/')[0];
  if (metricBaseName) {
    return categoryAliasesReverse[metricBaseName] || null;
  }

  console.warn('Unable to determine pluginId for result.', result);
  return null;
}

/**
 * Convert results to a table format compatible with MUV4 version.
 * @param {Object} eval_ - The evaluation object containing results.
 * @returns {Object} - A table format object containing the evaluation results.
 */
export function convertResultsToTable(eval_) {
  // Ensure that prompts exist in the results, specific to MUV4.
  if (!eval_?.prompts) {
    throw new Error(`Prompts are required in this version of the results file, this needs to be results file version >= 4, version: ${eval_.version}`);
  }

  const results = eval_.results || [];
  const completedPrompts = [];
  const varsForHeader = new Set();
  const varValuesForRow = new Map();

  const rowMap = {};
  for (const result of results) {
    // Extract vars for the header.
    if (result?.vars) {
      Object.keys(result.vars).forEach((varName) => varsForHeader.add(varName));
    }

    // Prepare row for the result.
    const row = rowMap[result?.testIdx] || {
      description: result?.description || undefined,
      outputs: [],
      vars: result?.vars ? Object.values(varsForHeader).map((varName) => {
        const varValue = result.vars?.[varName] || '';
        return typeof varValue === 'string' ? varValue : JSON.stringify(varValue);
      }) : [],
      test: result?.testCase || null,
    };

    // Store row by testIdx.
    rowMap[result?.testIdx] = row;
    varValuesForRow.set(result?.testIdx, result?.vars);

    // Format the result text.
    let resultText = result?.response?.output || result?.error || '';
    const failReasons = (result?.gradingResult?.componentResults || [])
      .filter((res) => res && !res.pass)
      .map((res) => res?.reason)
      .join(' --- ');

    if (result?.testCase?.assert) {
      if (result?.success) {
        resultText = `${result?.response?.output || result?.error || ''}`;
      } else {
        resultText = `${result?.error || failReasons}\n---\n${result?.response?.output}`;
      }
    }

    row.outputs[result?.promptIdx] = {
      id: result?.id || `${result?.testIdx}-${result?.promptIdx}`,
      ...result,
      text: resultText,
      prompt: result?.prompt?.raw || '',
      provider: result?.provider?.label || result?.provider?.id || 'unknown provider',
      pass: result?.success || false,
      failureReason: result?.failureReason || null,
      cost: result?.cost || 0,
    };

    // Ensure metrics exist for prompts.
    const prompt = completedPrompts[result?.promptIdx] || { metrics: new PromptMetrics() };
    completedPrompts[result?.promptIdx] = prompt;

    prompt.metrics.score += result?.score || 0;
    prompt.metrics.testPassCount += result?.success ? 1 : 0;
    prompt.metrics.testFailCount += result?.success ? 0 : 1;
    prompt.metrics.testErrorCount += result?.failureReason === ResultFailureReason.ERROR ? 1 : 0;
    prompt.metrics.assertPassCount += (result?.gradingResult?.componentResults || []).filter((r) => r?.pass).length || 0;
    prompt.metrics.assertFailCount += (result?.gradingResult?.componentResults || []).filter((r) => !r?.pass).length || 0;
    prompt.metrics.totalLatencyMs += result?.latencyMs || 0;
    prompt.metrics.tokenUsage.cached += result?.response?.tokenUsage?.cached || 0;
    prompt.metrics.tokenUsage.completion += result?.response?.tokenUsage?.completion || 0;
    prompt.metrics.tokenUsage.prompt += result?.response?.tokenUsage?.prompt || 0;
    prompt.metrics.tokenUsage.total += result?.response?.tokenUsage?.total || 0;
    prompt.metrics.cost += result?.cost || 0;
  }

  const rows = Object.values(rowMap);
  const sortedVars = [...varsForHeader].sort();
  rows.forEach((row) => {
    row.vars = sortedVars.map((varName) => varValuesForRow.get(row?.testIdx)?.[varName] || '');
  });

  return {
    head: {
      prompts: completedPrompts,
      vars: sortedVars,
    },
    body: rows,
  };
}
