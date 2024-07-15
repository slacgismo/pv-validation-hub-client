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
import CustomGraphics from '@/app/modules/svg/customGraphics';
import ColorPalette from '@/app/modules/svg/colorPalette.json';

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

  let analysisId: string | number | null = searchParams.get('analysisId');

  if ((
    analysisId !== 'development'
  ) && (
    analysisId !== null
  )) {
    analysisId = parseInt(
        analysisId.toString() || '', 10);
  } else if ((
    analysisId !== null
  ) && (
    isNaN(parseInt(analysisId))
  ) && (
    analysisId === 'development'
  )) {
    console.log('Development analysis');
  } else {
    console.log('NO!', analysisId);
    navigate.push('/analyses');
  }
  const [leaderboardDetails, setLeaderboardDetails] = useState<{
    id: number;
    file_completion: number;
    created_by: string;
    execution_time: number;
    status: string;
    metrics: Array<string>;
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
      flex: 1.5,
      filterable: false,
      sortable: false,
      groupable: false,
      renderCell: (params: any) => {
        const {value} = params;
        if (value !== null && value !== undefined && value !== 'N/A') {
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
      field: 'submitted_at',
      headerName: 'Submission Date',
      flex: 1.5,
      filterable: false,
      sortable: false,
      groupable: false,
      renderCell: (params: any) => {
        const {value} = params;
        if (value !== null || value !== undefined) {
          return (
            <div className="">
              {value}
            </div>
          );
        } else {
          return 'N/A';
        }
      },
    },
    {
      field: 'file_completion',
      headerName: 'File Completion',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: false,
      sortable: false,
      groupable: false,
      headerClassName: 'text-center',
      valueGetter: (params: any) => {
        return (
          (
            params !== null
          ) && (
            params !== undefined
          ) ? (100 - params) + '%' : 0 + '%'
        );
      },
    },
    {
      field: 'execution_time',
      headerName: 'Execution Time',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params: any) => {
        return params !== null && params !== undefined ? params : 0;
      },
    },
    {
      field: 'error',
      headerName: 'Error',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params: any) => {
        return params !== null && params !== undefined ? params : 'N/A';
      },
    },
    {
      field: 'metrics',
      headerName: 'Metrics',
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      groupable: false,
      headerClassName: 'text-center',
      flex: 1.5,
      renderCell: (params) => {
        // params.value needs to be an array of strings.
        let metrics;
        let id;
        if (Array.isArray(params.value)) {
          try {
            // Attempt to parse the JSON string
            metrics = params.value;
            id = params.id;
          } catch (error) {
            console.error('Failed to retrieve a metrics array:', error);
            metrics = [];
            id = 0;
          }
        } else {
          console.error('Failed to retrieve a metrics array.',
              ' Instead received: ', params.value
          );
          metrics = [];
          id = 0;
        }
        return (
          <Box>
            {metrics.map((name: string, index: number) => {
              const key=`${index}-${name}-${id}`;
              const hex=ColorPalette[index];
              return (
                // eslint-disable-next-line
                CustomGraphics.useSvg(hex, name, key) // useSVG is a custom hook that returns an SVG component
              );
            })}
          </Box>
        );
      },
    },
  ];
  useEffect(() => {
    if (typeof analysisId === 'number') {
      const url = `/analysis/${analysisId}/leaderboard`;
      console.log('Leaderboard URL:', url);
      DashboardService.getLeaderBoard(url)
          .then((leaderboardResponse) => {
            setLeaderboardIsLoading(false);
            const resp = leaderboardResponse.data;
            return DashboardService.formatResponse(resp.submissions);
          })
          .then((formattedResponse) => {
            console.log('Formatted response:', formattedResponse);
            if (formattedResponse.length > 0) {
              setLeaderboardDetails(formattedResponse);
            } else {
              setLeaderboardDetails([{
                id: 0,
                file_completion: 0,
                created_by: 'N/A',
                execution_time: 0,
                status: 'N/A',
                metrics: ['N/A'],
                error: 0,
              }]);
            }
          })
          .catch((error) => {
            setLeaderboardError(error);
            setLeaderboardDetails([]);
            setLeaderboardIsLoading(false);
          });
    } else if (analysisId === 'development') {
      setLeaderboardDetails([{
        id: 0,
        file_completion: 0,
        created_by: 'Development',
        execution_time: 0,
        status: 'Development',
        metrics: ['Development'],
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
