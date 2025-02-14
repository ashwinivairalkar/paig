import React, { useEffect, useMemo, useState } from 'react';
//import { callApi } from '@app/utils/api';
import { callApi } from './api'; 
import WarningIcon from '@material-ui/icons/Warning'; // Update icon import for MUI v4
import Box from '@material-ui/core/Box'; // Change MUI imports for v4
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
//import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
//import Stack from '@material-ui/core/Stack';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
//import { categoryAliasesReverse } from '@promptfoo/redteam/constants';
//import { isProviderOptions, ResultFailureReason } from '@promptfoo/types';
//import { convertResultsToTable } from '@promptfoo/util/convertEvalResultsToTable';
//import FrameworkCompliance from './FrameworkCompliance';
//import Overview from './Overview';
import ReportDownloadButton from './ReportDownloadButton';
//import ReportSettingsDialogButton from './ReportSettingsDialogButton';
//import RiskCategories from './RiskCategories';
//import StrategyStats from './StrategyStats';
import TestSuites from './TestSuites';
import ToolsDialog from './ToolsDialog';
//import { getPluginIdFromResult, getStrategyIdFromMetric } from './shared';
import './Report.css';

const App = () => {
  const [evalId, setEvalId] = useState(null);
  const [evalData, setEvalData] = useState(null);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isToolsDialogOpen, setIsToolsDialogOpen] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const fetchEvalById = async (id) => {
      const resp = await callApi(`/results/${id}`, { cache: 'no-store' });
      const body = await resp.json();
      setEvalData(body.data);
    };

    const evalId = searchParams.get('evalId');
    if (evalId) {
      setEvalId(evalId);
      fetchEvalById(evalId);
    } else {
      const fetchLatestEvalId = async () => {
        try {
          const resp = await callApi('/results', { cache: 'no-store' });
          if (!resp.ok) {
            console.error('Failed to fetch recent evals');
            return;
          }
          const body = await resp.json();
          if (body.data && body.data.length > 0) {
            const latestEvalId = body.data[0].evalId;
            setEvalId(latestEvalId);
            fetchEvalById(latestEvalId);
          }
        } catch (error) {
          console.error('Error fetching latest eval:', error);
        }
      };
      fetchLatestEvalId();
    }
  }, []);

  useEffect(() => {
    document.title = `Report: ${evalData?.config?.description || evalId || 'Red Team'} | promptfoo`;
  }, [evalData, evalId]);

  if (!evalData || !evalId) {
    return <Box sx={{ width: '100%', textAlign: 'center' }}>Loading...</Box>;
  }

  return (
    <Container>
      <Stack spacing={4} pb={8} pt={2}>
        <Card className="report-header">
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex' }}>
            <ReportDownloadButton
              evalDescription={evalData.config.description || evalId}
              evalData={evalData}
            />
            <ReportSettingsDialogButton />
          </Box>
          <Typography variant="h4">
            <strong>LLM Risk Assessment</strong>
            {evalData.config.description && `: ${evalData.config.description}`}
          </Typography>
        </Card>
        <Overview categoryStats={{}} plugins={evalData.config.redteam?.plugins || []} />
        <FrameworkCompliance categoryStats={{}} strategyStats={{}} />
        <StrategyStats strategyStats={{}} failuresByPlugin={{}} passesByPlugin={{}} />
        <RiskCategories
          categoryStats={{}}
          strategyStats={{}}
          evalId={evalId}
          failuresByPlugin={{}}
          passesByPlugin={{}}
        />
        <TestSuites
          evalId={evalId}
          categoryStats={{}}
          plugins={evalData.config.redteam?.plugins || []}
        />
      </Stack>
    </Container>
  );
};

export default App;
