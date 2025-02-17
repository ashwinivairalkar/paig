import React, { useState } from 'react';
import Box from '@material-ui/core/Box'; // MUI v4 import
import Button from '@material-ui/core/Button'; // MUI v4 import
import Table from '@material-ui/core/Table'; // MUI v4 import
import TableBody from '@material-ui/core/TableBody'; // MUI v4 import
import TableCell from '@material-ui/core/TableCell'; // MUI v4 import
import TableContainer from '@material-ui/core/TableContainer'; // MUI v4 import
import TableHead from '@material-ui/core/TableHead'; // MUI v4 import
import TablePagination from '@material-ui/core/TablePagination'; // MUI v4 import
import TableRow from '@material-ui/core/TableRow'; // MUI v4 import
import TableSortLabel from '@material-ui/core/TableSortLabel'; // MUI v4 import
import Tooltip from '@material-ui/core/Tooltip'; // MUI v4 import
import Typography from '@material-ui/core/Typography'; // MUI v4 import
import {
  categoryAliases,
  displayNameOverrides,
  riskCategories,
  Severity,
  subCategoryDescriptions,
} from './constants';
import { getRiskCategorySeverityMap } from './sharedFrontend';
import PropTypes from 'prop-types';
import './TestSuites.css';

const getSubCategoryStats = (categoryStats, plugins) => {
  const subCategoryStats = [];
  for (const subCategories of Object.values(riskCategories)) {
    for (const subCategory of subCategories) {
      subCategoryStats.push({
        pluginName: subCategory,
        type: categoryAliases[subCategory] || subCategory,
        description: subCategoryDescriptions[subCategory] || '',
        passRate: categoryStats[subCategory]
          ? `${((categoryStats[subCategory].pass / categoryStats[subCategory].total) * 100).toFixed(1)}%`
          : 'N/A',
        passRateWithFilter: categoryStats[subCategory]
          ? `${((categoryStats[subCategory].passWithFilter / categoryStats[subCategory].total) * 100).toFixed(1)}%`
          : 'N/A',
        severity: getRiskCategorySeverityMap(plugins)[subCategory] || 'Unknown',
      });
    }
  }

  return subCategoryStats.sort((a, b) => {
    if (a.passRate === 'N/A') return 1;
    if (b.passRate === 'N/A') return -1;
    return parseFloat(a.passRate) - parseFloat(b.passRate);
  });
};

const TestSuites = ({ evalId, categoryStats, plugins }) => {
  const subCategoryStats = getSubCategoryStats(categoryStats, plugins).filter(
    (subCategory) => subCategory.passRate !== 'N/A',
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('default');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom id="table">
        Vulnerabilities and Mitigations
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'passRate'}
                  direction={orderBy === 'passRate' ? order : 'asc'}
                  onClick={() => handleSort('passRate')}
                >
                  Pass rate
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'severity'}
                  direction={orderBy === 'severity' ? order : 'asc'}
                  onClick={() => handleSort('severity')}
                >
                  Severity
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ minWidth: '275px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategoryStats
              .sort((a, b) => {
                if (orderBy === 'passRate') {
                  if (a.passRate === 'N/A') return 1;
                  if (b.passRate === 'N/A') return -1;
                  return order === 'asc'
                    ? parseFloat(a.passRate) - parseFloat(b.passRate)
                    : parseFloat(b.passRate) - parseFloat(a.passRate);
                } else if (orderBy === 'severity') {
                  if (a.passRate === 'N/A') return 1;
                  if (b.passRate === 'N/A') return -1;
                  const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
                  return order === 'asc'
                    ? severityOrder[a.severity] - severityOrder[b.severity]
                    : severityOrder[b.severity] - severityOrder[a.severity];
                } else {
                  const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
                  if (a.severity === b.severity) {
                    return parseFloat(a.passRate) - parseFloat(b.passRate);
                  } else {
                    return severityOrder[b.severity] - severityOrder[a.severity];
                  }
                }
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((subCategory, index) => {
                let passRateClass = '';
                if (subCategory.passRate !== 'N/A') {
                  const passRate = parseFloat(subCategory.passRate);
                  if (passRate >= 75) passRateClass = 'pass-high';
                  else if (passRate >= 50) passRateClass = 'pass-medium';
                  else passRateClass = 'pass-low';
                }

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <span style={{ fontWeight: 500 }}>
                        {displayNameOverrides[subCategory.pluginName] || subCategory.type}
                      </span>
                    </TableCell>
                    <TableCell>{subCategory.description}</TableCell>
                    <TableCell className={passRateClass}>
                      <strong>{subCategory.passRate}</strong>
                      {subCategory.passRateWithFilter === subCategory.passRate ? null : (
                        <>
                          <br />({subCategory.passRateWithFilter} with mitigation)
                        </>
                      )}
                    </TableCell>
                    <TableCell className={`vuln-${subCategory.severity.toLowerCase()}`}>
                      {subCategory.severity}
                    </TableCell>
                    <TableCell style={{ minWidth: 270 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          const searchParams = new URLSearchParams(window.location.search);
                          const evalId = searchParams.get('evalId');
                          window.location.href = `/eval/?evalId=${evalId}&search=${encodeURIComponent(`(var=${subCategory.type}|metric=${subCategory.type})`)}`;
                        }}
                      >
                        View logs
                      </Button>
                      <Tooltip title="Temporarily disabled while in beta, click to contact us to enable">
                        <Button
                          variant="contained"
                          size="small"
                          color="inherit"
                          style={{ marginLeft: 8 }}
                          onClick={() => {
                            window.location.href =
                              'mailto:inquiries@promptfoo.dev?subject=Promptfoo%20automatic%20vulnerability%20mitigation';
                          }}
                        >
                          Apply mitigation
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {subCategoryStats.length > rowsPerPage && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={subCategoryStats.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TableContainer>
    </Box>
  );
};

TestSuites.propTypes = {
  evalId: PropTypes.string.isRequired,
  categoryStats: PropTypes.object.isRequired,
  plugins: PropTypes.array.isRequired,
};

export default TestSuites;
