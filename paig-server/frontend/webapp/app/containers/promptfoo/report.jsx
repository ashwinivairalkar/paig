
const App = () => {
  const [evalId, setEvalId] = useState(null);
  const [evalData, setEvalData] = useState(null);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isToolsDialogOpen, setIsToolsDialogOpen] = useState(false);
  

  /*const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const fetchEvalById = async (id) => {
      const resp = await callApi(`/results/${id}`, { cache: 'no-store' });
      const body = await resp.json();
      setEvalData(body.data);
    };

     //evalId = searchParams.get('evalId');
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

 /* if (!evalData || !evalId) {
    return <Box sx={{ width: '100%', textAlign: 'center' }}>Loading...</Box>;
  }*/

  return (
    /*<Container>
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
    </Container>*/
   <h1> hii</h1>
  );
};

export default App;
