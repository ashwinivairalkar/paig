import React, { useState, useEffect } from 'react';
import SettingsIcon from '@material-ui/icons/Settings'; // MUI v4
import Button from '@material-ui/core/Button'; // MUI v4
import Dialog from '@material-ui/core/Dialog'; // MUI v4
import DialogActions from '@material-ui/core/DialogActions'; // MUI v4
import DialogContent from '@material-ui/core/DialogContent'; // MUI v4
import DialogTitle from '@material-ui/core/DialogTitle'; // MUI v4
import IconButton from '@material-ui/core/IconButton'; // MUI v4
import Slider from '@material-ui/core/Slider'; // MUI v4
import Tooltip from '@material-ui/core/Tooltip'; // MUI v4
import Typography from '@material-ui/core/Typography'; // MUI v4
import CircularProgress from '@material-ui/core/CircularProgress'; // For Loading Spinner
//import { useReportStore } from './store'; // Assuming you have a store for managing the state

const ReportSettingsDialogButton = () => {
  const {
    showPercentagesOnRiskCards,
    setShowPercentagesOnRiskCards,
    pluginPassRateThreshold,
    setPluginPassRateThreshold,
    showComplianceSection,
    setShowComplianceSection,
    isLoading, // Assuming you have a loading state to check whether the store is still loading
  } = useReportStore();
  
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Render a loading state if the store is fetching data
  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Tooltip title="Report Settings" placement="top">
        <IconButton onClick={handleOpen} aria-label="settings">
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Report Settings</DialogTitle>
        <DialogContent>
          <Typography component="div" style={{ padding: '16px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showComplianceSection}
                onChange={(e) => setShowComplianceSection(e.target.checked)}
                style={{ marginRight: '10px' }}
              />
              Show compliance section (NIST, OWASP)
            </label>
          </Typography>
          <Typography component="div" style={{ padding: '16px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showPercentagesOnRiskCards}
                onChange={(e) => setShowPercentagesOnRiskCards(e.target.checked)}
                style={{ marginRight: '10px' }}
              />
              Show percentages on risk cards
            </label>
          </Typography>
          <Typography component="div" style={{ padding: '16px 0' }}>
            <label>Plugin Pass Rate Threshold: {(pluginPassRateThreshold * 100).toFixed(0)}%</label>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
              Sets the threshold for considering a plugin as passed on the risk cards.
            </Typography>
            <Slider
              value={pluginPassRateThreshold}
              onChange={(_, newValue) => setPluginPassRateThreshold(newValue)}
              aria-labelledby="plugin-pass-rate-threshold-slider"
              step={0.05}
              marks
              min={0}
              max={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportSettingsDialogButton;
