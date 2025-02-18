import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Severity, severityDisplayNames } from './constants';
import { getRiskCategorySeverityMap } from './sharedFrontend';
import { useReportStore } from './store';
import './Overview.css';

const useStyles = makeStyles((theme) => ({
  severityCard: {
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
  },
}));

const Overview = ({ categoryStats, plugins }) => {
  const classes = useStyles();
  const { pluginPassRateThreshold } = useReportStore();

  const severityCounts = Object.values(Severity).reduce((acc, severity) => {
    acc[severity] = Object.keys(categoryStats).reduce((count, category) => {
      const stats = categoryStats[category];
      const passRate = stats.pass / stats.total;
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
    <Grid container spacing={2}>
      {Object.values(Severity).map((severity) => (
        <Grid item xs={12} sm={6} md={3} key={severity}>
          <Box flex={1}>
            <Card
              className={`${classes.severityCard} severity-card card-${severity.toLowerCase()}`}
              onClick={() => (window.location.hash = '#table')}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {severityDisplayNames[severity]}
                </Typography>
                <Typography variant="h4" color="textPrimary">
                  {severityCounts[severity]}
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
