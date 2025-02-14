import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@material-ui/core'; // Correct imports for MUI v4
import { makeStyles } from '@material-ui/core/styles';
// Uncomment these imports if needed
// import { Severity, severityDisplayNames } from '@promptfoo/redteam/constants';
// import { getRiskCategorySeverityMap } from '@promptfoo/redteam/sharedFrontend';
// import { useReportStore } from './store';
// import './Overview.css'; // Assuming you will use custom CSS, make sure it's correct

const useStyles = makeStyles((theme) => ({
  severityCard: {
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  },
  severityBox: {
    flex: 1,
    padding: theme.spacing(1),
  },
}));

const Overview = ({ categoryStats, plugins }) => {
  const classes = useStyles();
  const { pluginPassRateThreshold } = useReportStore(); // Assuming useReportStore hook is set up

  // Calculate severity counts based on the passed categoryStats and plugins
  const severityCounts = Object.values(Severity).reduce((acc, severity) => {
    acc[severity] = Object.keys(categoryStats).reduce((count, category) => {
      const stats = categoryStats[category];
      const passRate = stats.pass / stats.total;

      // Check if the severity matches and the pass rate is below the threshold
      if (
        getRiskCategorySeverityMap(plugins)[category] === severity &&
        passRate < pluginPassRateThreshold
      ) {
        return count + 1;
      }
      return count;
    }, 0);
    return acc;
  }, {});

  return (
    // Grid container with spacing
    <Grid container spacing={2}>
      {Object.values(Severity).map((severity) => (
        <Grid item xs={12} sm={6} md={3} key={severity}>
          <Box className={classes.severityBox}>
            <Card
              className={`${classes.severityCard} severity-card card-${severity.toLowerCase()}`}
              onClick={() => (window.location.hash = '#table')}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {severityDisplayNames[severity]} {/* Display severity name */}
                </Typography>
                <Typography variant="h4" color="textPrimary">
                  {severityCounts[severity]} {/* Display count of issues */}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  issues
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Overview;
