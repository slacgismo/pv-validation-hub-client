'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import {Box, CircularProgress} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {GridColDef} from '@mui/x-data-grid';
import Link from 'next/link';

// *********** MODULE IMPORTS ***********

import DashboardService from '@/services/dashboard_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * Leaderboard component
 * @param {number} analysisId
 * @return {JSX.Element}
 */
export default function Leaderboard({analysisId}:
  {analysisId: number | string}) {
  console.log('TODO: Add dynamic functionality here. We need to combine ',
      'dynamic column generation from the backend with the base column ',
      'list here.');

  const columns: GridColDef[] = [
    {
      field: 'created_by',
      headerName: 'Developer Group',
      width: 250,
      filterable: false,
      sortable: false,
      groupable: false,
      renderCell: (params: any) => {
        const {value} = params;
        if (value !== null || value !== undefined) {
          const link = `/profile/${value.id}`;
          return (
            <Link href={link} className="standardLink">
              {value.username}
            </Link>
          );
        } else {
          return 'N/A';
        }
      },
    },
    {
      field: 'error_rate',
      headerName: 'Error Rate',
      filterable: false,
      sortable: false,
      groupable: false,
      width: 100,
      valueGetter: (params: any) => {
        const value = `${params.row.error_rate}%`;
        return value !== null && value !== undefined ? value : 0;
      },
    },
    {
      field: 'error',
      headerName: 'Error',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      valueGetter: (params: any) => {
        const value = params.row.error;
        return value !== null && value !== undefined ? value : 'N/A';
      },
    },
    {
      field: 'execution_time',
      headerName: 'Execution Time',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      valueGetter: (params: any) => {
        const value = params.row.execution_time;
        return value !== null && value !== undefined ? value : 0;
      },
    },
    {
      field: 'metrics',
      headerName: 'Metrics',
      filterable: false,
      sortable: false,
      groupable: false,
      width: 360,
    },
  ];
  const url = `/analysis/${analysisId}/leaderboard`;
  const [isLoading, rows] = DashboardService.useGetLeaderBoard(url);
  return (
    isLoading || rows === undefined ? <CircularProgress /> :
      (
        <Box sx={{height: 600}}>
          <DataGrid
            columns={columns}
            rows={Array.isArray(rows) ? rows : []}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </Box>
      )
  );
}
