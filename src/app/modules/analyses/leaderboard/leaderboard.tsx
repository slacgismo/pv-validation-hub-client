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
  let validAnalysisParam = false;

  // Check if the analysis ID is a number and store as variable due to typescript
  // limitations doing it directly in my next if statement
  if (
    analysisId !== null && analysisId !== 'development'
  ) {
    validAnalysisParam = isNaN(parseInt(analysisId.toString()));
  }

  if ((
    analysisId !== 'development'
  ) && (
    analysisId !== null
  ) && !validAnalysisParam) {
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
    navigate.push('/analyses');
  }
  const [leaderboardDetails, setLeaderboardDetails] = useState<{
    id: number;
    file_completion: number;
    created_by: string;
    execution_time: number;
    status: string;
    dataRequirements: Array<string>;
    error: number;
  }[]>([]);
  const [isLeaderboardLoading, setLeaderboardIsLoading] = useState(true);
  // eslint-disable-next-line
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [
    analysisErrorTypes, setAnalysisErrorTypes,
  ] = useState<{ [key: string]: string }>({'error': 'Error'});

  const baseColumns: GridColDef[] = [
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
      field: 'python_version',
      headerName: 'Python',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      valueGetter: (params: any) => {
        return params !== null && params !== undefined ? params : 'N/A';
      },
    },
    {
      field: 'dataRequirements',
      headerName: 'Data Requirements',
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      groupable: false,
      headerClassName: 'text-center',
      flex: 1.5,
      renderCell: (params) => {
        // params.value needs to be an array of strings.
        let dataRequirements;
        let id;
        if (Array.isArray(params.value)) {
          try {
            // Attempt to parse the JSON string
            dataRequirements = params.value;
            id = params.id;
          } catch (error) {
            console.error('Failed to retrieve a dataRequirements array:',
                error);
            dataRequirements = [];
            id = 0;
          }
        } else {
          console.error('Failed to retrieve a dataRequirements array.',
              ' Instead received: ', params.value
          );
          dataRequirements = [];
          id = 0;
        }
        return (
          <Box>
            {dataRequirements.map((name: string, index: number) => {
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

  const [columns, setColumns] = useState(baseColumns);

  const resetDefaultColumns = (columnArray: GridColDef[]) => {
    setColumns(baseColumns);
    columnArray.push({
      field: 'error',
      headerName: 'Error',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params: any) => {
        return params !== null && params !== undefined ? params : 'N/A';
      },
    });
    setColumns(columnArray);
  };

  const setDynamicColumns = (columnArray: GridColDef[]) => {
    setColumns(baseColumns);
    for (const key in analysisErrorTypes) {
      if (key in analysisErrorTypes) {
        columnArray.push({
          field: key,
          headerName: `${analysisErrorTypes[key]}`,
          headerAlign: 'center',
          align: 'center',
          flex: 0.5,
          valueGetter: (params: any) => {
            return params !== null && params !== undefined ? params : 'N/A';
          },
        });
      }
    }
    setColumns(columnArray);
  };

  useEffect(() => {
    // use map to create a new array of columns due to arrays in variables sharing the same memory pointer
    const columnArray = baseColumns.map((column) => {
      return column;
    }
    );
    if (typeof analysisId === 'number') {
      const url = `/analysis/${analysisId}/leaderboard`;
      DashboardService.getLeaderBoard(url)
          .then((leaderboardResponse) => {
            setLeaderboardIsLoading(false);
            const resp = leaderboardResponse.data;
            return DashboardService.formatResponse(resp.submissions);
          })
          .then((formattedResponse) => {
            if (formattedResponse.length > 0) {
              setLeaderboardDetails(formattedResponse);
            } else {
              setLeaderboardDetails([{
                id: 0,
                file_completion: 0,
                created_by: 'N/A',
                execution_time: 0,
                status: 'N/A',
                dataRequirements: ['N/A'],
                error: 0,
              }]);
            }
          })
          .catch((error) => {
            resetDefaultColumns(columnArray);
            setLeaderboardError(error);
            setLeaderboardDetails([]);
            setLeaderboardIsLoading(false);
          });
      DashboardService.getAnalysisDetails(analysisId)
          .then((response) => {
            setAnalysisErrorTypes(response.data.display_errors);
          })
          .catch((error) => {
            console.error('Failed to get analysis details:', error);
            resetDefaultColumns(columnArray);
          });
    } else if (analysisId === 'development') {
      setLeaderboardDetails([{
        id: 0,
        file_completion: 0,
        created_by: 'Development',
        execution_time: 0,
        status: 'Development',
        dataRequirements: ['Development'],
        error: 0,
      }]);
      resetDefaultColumns(columnArray);
    } else {
      setLeaderboardDetails([]);
      setLeaderboardIsLoading(false);
      resetDefaultColumns(columnArray);
      console.error('Invalid analysis ID');
      console.error('Analysis ID:', analysisId);
      console.error('Analysis failed to load.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId]);

  useEffect(() => {
  }, [leaderboardDetails]);

  useEffect(() => {
    // use map to create a new array of columns due to arrays in variables sharing the same memory pointer
    const columnArray = baseColumns.map((column) => {
      return column;
    }
    );
    setDynamicColumns(columnArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisErrorTypes]);

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
