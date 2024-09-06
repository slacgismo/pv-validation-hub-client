'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import {Box} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {GridColDef} from '@mui/x-data-grid';
import {Typography} from '@mui/material';

// *********** MODULE IMPORTS ***********

import demo from '@/app/modules/homepage/demo.json';
import CustomGraphics from '@/app/modules/svg/customGraphics';
import ColorPalette from '@/app/modules/svg/colorPalette.json';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * Leaderboard component
 * @param {number} analysisId
 * @return {JSX.Element}
 */
export default function DemoBoard() {
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
        if (value !== null || value !== undefined) {
          return (
            <div className="standardLink">
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
        return params !== null && params !== undefined ?
        params.toFixed(2) + '%' : 0 + '%';
      },
    },
    {
      field: 'error',
      headerName: 'Error',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params: any) => {
        return params !== null && params !== undefined ?
        params.toFixed(2) : 'N/A';
      },
    },
    {
      field: 'execution_time',
      headerName: 'Execution Time',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params: any) => {
        return params !== null && params !== undefined ?
        params.toFixed(2) : 0;
      },
    },
    {
      field: 'metrics',
      headerName: 'Data Requirements',
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      groupable: false,
      headerClassName: 'text-center',
      flex: 1.5,
      renderCell: (params) => {
        // Assuming params.value is an array of SVG paths or components you want to render
        // You can adjust the rendering logic based on your actual data structure
        return (
          <Box>
            {params.value.map((name: string, index: number) => {
              const key=`${index}-${name}`;
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

  return (
    <Box sx={{
      height: '40dvh',
      width: '60dvw',
    }} className='content-center justify-center'>
      <Typography
        variant="h1"
        className="text-5xl font-bold sTextColor scale-[0.73] mt-2">
        Demo Board
      </Typography>
      <DataGrid
        columns={columns}
        disableColumnFilter={true}
        rows={Array.isArray(demo) ? demo : []}
        hideFooter={true}
        className="scale-[0.85] mb-2"
      />
    </Box>
  );
}
