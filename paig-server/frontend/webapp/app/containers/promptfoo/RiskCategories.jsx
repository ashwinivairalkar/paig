import React from 'react';
import Box from '@material-ui/core/Box'; // MUI v4 import (for spacing)
import { categoryDescriptions, riskCategories } from './constants';
import RiskCard from './RiskCard';

const RiskCategories = ({
  categoryStats,
  evalId,
  failuresByPlugin,
  passesByPlugin,
  strategyStats,
}) => {
  const categories = Object.keys(riskCategories).map((category) => ({
    name: category,
    passed: riskCategories[category].every(
      (subCategory) => categoryStats[subCategory]?.pass === categoryStats[subCategory]?.total,
    ),
  }));

  return (
    <Box display="flex" flexDirection="column" spacing={4}> {/* MUI v4 equivalent of Stack */}
      {categories.map((category, index) => {
        const categoryName = category.name;
        const subCategories = riskCategories[categoryName];

        const totalPasses = subCategories.reduce(
          (acc, subCategory) => acc + (categoryStats[subCategory]?.pass || 0),
          0,
        );
        const totalTests = subCategories.reduce(
          (acc, subCategory) => acc + (categoryStats[subCategory]?.total || 0),
          0,
        );

        return (
          <RiskCard
            key={index}
            title={category.name}
            subtitle={categoryDescriptions[categoryName]}
            progressValue={(totalPasses / totalTests) * 100}
            numTestsPassed={totalPasses}
            numTestsFailed={totalTests - totalPasses}
            testTypes={subCategories.map((subCategory) => ({
              name: subCategory,
              categoryPassed:
                categoryStats[subCategory]?.pass === categoryStats[subCategory]?.total,
              numPassed: categoryStats[subCategory]?.pass || 0,
              numFailed:
                (categoryStats[subCategory]?.total || 0) - (categoryStats[subCategory]?.pass || 0),
            }))}
            evalId={evalId}
            failuresByPlugin={failuresByPlugin}
            passesByPlugin={passesByPlugin}
            strategyStats={strategyStats}
          />
        );
      })}
    </Box>
  );
};

export default RiskCategories;
