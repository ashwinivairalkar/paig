import React, { useState, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  ALIASED_PLUGIN_MAPPINGS,
  categoryAliases,
  displayNameOverrides,
  FRAMEWORK_NAMES,
  FRAMEWORK_COMPLIANCE_IDS,
} from './constants';
//import { useReportStore } from './store';
import './FrameworkCompliance.css';

const useStyles = makeStyles((theme) => ({
  frameworkComplianceCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.palette.type === 'dark' ? '#1e1e1e' : '#f5f5f5',
    transition: 'box-shadow 0.3s ease-in-out',
  },
  frameworkGrid: {
    marginTop: theme.spacing(3),
  },
  frameworkItem: {
    height: '100%',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  },
  compliant: {
    backgroundColor: '#e8f5e9',
  },
  nonCompliant: {
    backgroundColor: '#ffebee',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressBarFill: {
    borderRadius: 4,
    backgroundColor: '#1976d2',
  },
  iconCompliant: {
    color: '#4caf50',
    fontSize: 24,
  },
  iconNonCompliant: {
    color: '#f44336',
    fontSize: 24,
  },
  expandableHeader: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
  },
}));

const FrameworkCompliance = ({ categoryStats, strategyStats }) => {
  const classes = useStyles();
  const { pluginPassRateThreshold, showComplianceSection } = useReportStore();
  const [expandedFrameworks, setExpandedFrameworks] = useState({});

  const getNonCompliantPlugins = useCallback(
    (framework) => {
      const mappings = ALIASED_PLUGIN_MAPPINGS[framework];
      if (!mappings) return [];

      return Array.from(
        new Set(
          Object.entries(mappings).flatMap(([_, { plugins, strategies }]) => {
            const nonCompliantItems = [...plugins, ...strategies].filter((item) => {
              const stats = categoryStats[item] || strategyStats[item];
              return stats && stats.total > 0 && stats.pass / stats.total < pluginPassRateThreshold;
            });
            return nonCompliantItems;
          })
        )
      );
    },
    [categoryStats, strategyStats, pluginPassRateThreshold]
  );

  const frameworkCompliance = useMemo(() => {
    return FRAMEWORK_COMPLIANCE_IDS.reduce((acc, framework) => {
      const nonCompliantPlugins = getNonCompliantPlugins(framework);
      acc[framework] = nonCompliantPlugins.length === 0;
      return acc;
    }, {});
  }, [getNonCompliantPlugins]);

  const totalFrameworks = FRAMEWORK_COMPLIANCE_IDS.length;
  const compliantFrameworks = Object.values(frameworkCompliance).filter(Boolean).length;

  const pluginComplianceStats = useMemo(() => {
    let totalPlugins = 0;
    let compliantPlugins = 0;

    FRAMEWORK_COMPLIANCE_IDS.forEach((framework) => {
      const mappings = ALIASED_PLUGIN_MAPPINGS[framework];
      if (!mappings) return;

      Object.entries(mappings).forEach(([_, { plugins, strategies }]) => {
        [...plugins, ...strategies].forEach((item) => {
          const stats = categoryStats[item] || strategyStats[item];
          if (stats && stats.total > 0) {
            totalPlugins++;
            if (stats.pass / stats.total >= pluginPassRateThreshold) {
              compliantPlugins++;
            }
          }
        });
      });
    });

    return { totalPlugins, compliantPlugins };
  }, [categoryStats, strategyStats, pluginPassRateThreshold]);

  const handleToggleExpand = (framework) => {
    setExpandedFrameworks((prev) => ({
      ...prev,
      [framework]: !prev[framework],
    }));
  };

  if (!showComplianceSection) {
    return null;
  }

  return (
    <Card className={classes.frameworkComplianceCard}>
      <CardContent>
        <Typography variant="h5">Framework Compliance</Typography>
        <Box mt={2}>
          <LinearProgress
            variant="determinate"
            value={(compliantFrameworks / totalFrameworks) * 100}
            className={classes.progressBarFill}
          />
        </Box>
        <Grid container spacing={2} className={classes.frameworkGrid}>
          {FRAMEWORK_COMPLIANCE_IDS.map((framework) => {
            const isCompliant = frameworkCompliance[framework];
            return (
              <Grid item xs={12} sm={6} md={4} key={framework}>
                <Card className={`${classes.frameworkItem} ${isCompliant ? classes.compliant : classes.nonCompliant}`}>
                  <CardContent>
                    <Box className={classes.expandableHeader} onClick={() => handleToggleExpand(framework)}>
                      <Typography variant="h6">
                        {FRAMEWORK_NAMES[framework] || framework}
                      </Typography>
                      <IconButton>
                        {expandedFrameworks[framework] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    <List>
                      {getNonCompliantPlugins(framework).map((plugin) => (
                        <ListItem key={plugin}>
                          <ListItemIcon>
                            {isCompliant ? (
                              <CheckCircleIcon className={classes.iconCompliant} />
                            ) : (
                              <CancelIcon className={classes.iconNonCompliant} />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={displayNameOverrides[plugin] || plugin} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FrameworkCompliance;
