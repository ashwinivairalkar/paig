import React from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Box, Card, CardContent, Grid, List, ListItem, ListItemText, Tooltip, Typography } from '@material-ui/core';
//import { Gauge } from '@mui/x-charts/Gauge'; // This might need checking for compatibility
import { categoryAliases, displayNameOverrides, subCategoryDescriptions } from './constants';
//import RiskCategoryDrawer from './RiskCategoryDrawer';
//import { useReportStore } from './store';
import './RiskCard.css';

const RiskCard = ({
  title,
  subtitle,
  progressValue,
  numTestsPassed,
  numTestsFailed,
  testTypes,
  evalId,
  failuresByPlugin,
  passesByPlugin,
  strategyStats,
}) => {
  const { showPercentagesOnRiskCards, pluginPassRateThreshold } = useReportStore();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('');

  // Hide risk cards with no tests
  const filteredTestTypes = testTypes.filter((test) => test.numPassed + test.numFailed > 0);
  if (filteredTestTypes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="risk-card-container">
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" className="risk-card-title">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" mb={2}>
              {subtitle}
            </Typography>
            <Box
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 100,
                height: 100,
              }}
            >
              <Gauge
                value={progressValue}
                max={100}
                thickness={10}
                arc={{
                  startAngle: -90,
                  endAngle: 90,
                  color: 'primary.main',
                }}
                text={Number.isNaN(progressValue) ? '-' : `${Math.round(progressValue)}%`}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
            <Typography variant="h6" className="risk-card-issues">
              {numTestsFailed} failed probes
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className="risk-card-tests-passed"
            >
              {numTestsPassed}/{numTestsPassed + numTestsFailed} passed
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <List dense>
              {filteredTestTypes.map((test, index) => {
                const percentage = test.numPassed / (test.numPassed + test.numFailed);
                return (
                  <Tooltip
                    key={index}
                    title={
                      subCategoryDescriptions[test.name]
                    }
                    placement="left"
                    arrow
                  >
                    <ListItem
                      className="risk-card-list-item"
                      onClick={() => {
                        setSelectedCategory(test.name);
                        setDrawerOpen(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <ListItemText
                        primary={
                          displayNameOverrides[test.name] ||
                          categoryAliases[test.name]
                        }
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                      {showPercentagesOnRiskCards ? (
                        <Typography
                          variant="body2"
                          className={`risk-card-percentage ${
                            percentage >= 0.8
                              ? 'risk-card-percentage-high'
                              : percentage >= 0.5
                                ? 'risk-card-percentage-medium'
                                : 'risk-card-percentage-low'
                          }`}
                        >
                          {`${Math.round(percentage * 100)}%`}
                        </Typography>
                      ) : percentage >= pluginPassRateThreshold ? (
                        <CheckCircleIcon className="risk-card-icon-passed" />
                      ) : (
                        <CancelIcon className="risk-card-icon-failed" />
                      )}
                    </ListItem>
                  </Tooltip>
                );
              })}
            </List>
          </Grid>
        </Grid>
        {selectedCategory && (
          <RiskCategoryDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            category={selectedCategory}
            failures={failuresByPlugin[selectedCategory] || []}
            passes={passesByPlugin[selectedCategory] || []}
            evalId={evalId}
            numPassed={testTypes.find((t) => t.name === selectedCategory)?.numPassed || 0}
            numFailed={testTypes.find((t) => t.name === selectedCategory)?.numFailed || 0}
            strategyStats={strategyStats}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RiskCard;
