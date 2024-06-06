'use client';
// *********** START OF IMPORTS ***********

import React, {useEffect, useState} from 'react';
import {Box, CircularProgress} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {GridColDef} from '@mui/x-data-grid';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/navigation';

// *********** MODULE IMPORTS ***********

import DashboardService from '@/services/dashboard_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * Leaderboard component
 * @param {number} analysisId
 * @return {JSX.Element}
 */
export default function Leaderboard() {
  const searchParams = useSearchParams();
  const navigate = useRouter();

  if (searchParams.get('analysisId') === null) {
    console.error('Analysis ID not found');
    navigate.push('/analyses');
  }

  const analysisId: string | number = parseInt(
      searchParams.get('analysisId') || '', 10);
  const [leaderboardDetails, setLeaderboardDetails] = useState<{
      id: number;
      error_rate: number;
      created_by: string;
      execution_time: number;
      status: string;
      metrics: string;
      error: number;
    }[]>([]);
  const [isLeaderboardLoading, setLeaderboardIsLoading] = useState(true);
  // eslint-disable-next-line
  const [leaderboardError, setLeaderboardError] = useState(null);
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
          const link = `/profile?u=${value}`;
          return (
            <Link href={link} className="standardLink">
              {value}
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
        return params !== null && params !== undefined ? params : 0;
      },
    },
    {
      field: 'error',
      headerName: 'Error',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      valueGetter: (params: any) => {
        return params !== null && params !== undefined ? params : 'N/A';
      },
    },
    {
      field: 'execution_time',
      headerName: 'Execution Time',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      valueGetter: (params: any) => {
        return params !== null && params !== undefined ? params : 0;
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
  useEffect(() => {
    if (typeof analysisId === 'number') {
      const url = `/analysis/${analysisId}/leaderboard`;
      console.log('Leaderboard URL:', url);
      DashboardService.getLeaderBoard(url)
          .then((leaderboardResponse) => {
            setLeaderboardIsLoading(false);
            return DashboardService.formatResponse(leaderboardResponse.data);
          })
          .then((formattedResponse) => {
            console.log('Formatted response:', formattedResponse);
            setLeaderboardDetails(formattedResponse);
          })
          .catch((error) => {
            setLeaderboardError(error);
            setLeaderboardDetails([]);
            setLeaderboardIsLoading(false);
          });
    } else if (analysisId === 'development') {
      setLeaderboardDetails([{
        id: 0,
        error_rate: 0,
        created_by: 'Development',
        execution_time: 0,
        status: 'Development',
        metrics: 'Development',
        error: 0,
      }]);
      setLeaderboardIsLoading(false);
    } else {
      setLeaderboardDetails([]);
      setLeaderboardIsLoading(false);
      console.error('Invalid analysis ID');
      console.error('Analysis ID:', analysisId);
      console.error('Analysis failed to load.');
    }
  }, [analysisId]);

  useEffect(() => {
    console.log('Leaderboard details:', leaderboardDetails);
  }, [leaderboardDetails]);

  return (
    isLeaderboardLoading || (
      leaderboardDetails === undefined || leaderboardDetails.length === 0
    ) ? <CircularProgress /> :
      (
        <Box sx={{height: 600}}>
          <DataGrid
            columns={columns}
            rows={Array.isArray(leaderboardDetails) ? leaderboardDetails : []}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </Box>
      )
  );
}
