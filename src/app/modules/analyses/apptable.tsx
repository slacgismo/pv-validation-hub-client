'use client';
// *********** START OF IMPORTS ***********

import React, {useState} from 'react';
import {
  Box,
  Paper,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import {visuallyHidden} from '@mui/utils';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * @param {Object} props
 * @param {Array} props.rows
 * @param {Array} props.cols
 * @return {JSX.Element}
 */
export default function AppTable({rows, cols}: {rows: any[], cols: any[]}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // eslint-disable-next-line no-unused-vars
  const handleChangePage = (event: any,
      newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  // eslint-disable-next-line no-unused-vars
  const handleChangeRowsPerPage = (
      event: {
        target: {
    value: string | number;
  };
}) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /**
   * @param {Object} a
   * @param {Object} b
   * @param {string} orderedBy
   * @return {number}
   */
  function descendingComparator(a: { [x: string]: number; },
      b: { [x: string]: number; }, orderedBy: string) {
    if (b[orderedBy] < a[orderedBy]) {
      return -1;
    }
    if (b[orderedBy] > a[orderedBy]) {
      return 1;
    }
    return 0;
  }

  /**
   * @param {string} orderMethod
   * @param {string} orderedBy
   * @return {function}
   */
  function getComparator(orderMethod: string, orderedBy: string) {
    return orderMethod === 'desc' ?
      (a: any, b: any) => descendingComparator(a, b, orderedBy) :
      (a: any, b: any) => -descendingComparator(a, b, orderedBy);
  }

  /**
   * @param {Array} array
   * @param {function} comparator
   * @return {Array}
   */
  function stableSort(array: any[],
      comparator: { (a: any, b: any): number;
      (arg0: any, arg1: any): any; }) {
    const stabilizedThis = array.map((el: any, index: any) => [el, index]);
    stabilizedThis.sort((a: number[], b: number[]) => {
      const orderedList = comparator(a[0], b[0]);
      if (orderedList !== 0) {
        return orderedList;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el: any[]) => el[0]);
  }
  const handleRequestSort = (event: any,
      property: React.SetStateAction<string>) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property: any) => (event: any) => {
    handleRequestSort(event, property);
  };

  return (
    <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <TableContainer sx={{maxHeight: 440}}>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {
                cols.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{minWidth: column.minWidth}}
                    sortDirection={orderBy === column.id ?
                      order as SortDirection : undefined}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ?
                        order as ('asc' | 'desc' | undefined) : undefined}
                      onClick={createSortHandler(column.id)}
                    >
                      <b>{column.label}</b>
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ?
                          'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: { [x: string]: any; }, index: any) => {
                    const notIndex = `table-row-${index}`;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={notIndex}>
                        {
                          cols.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && (value !== null ||
                                  value !== undefined) ?
                                  column.format(value) : '-'}
                              </TableCell>
                            );
                          })
                        }
                      </TableRow>
                    );
                  })
            }
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
}
