'use client';
// *********** START OF IMPORTS ***********

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Checkbox from '@mui/material/Checkbox';
import {GridColDef} from '@mui/x-data-grid';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';

// *********** MODULE IMPORTS ***********

import SubmissionService from '@/services/submission_service';
import AnalysisService from '@/services/analysis_service';
import UserService from '@/services/user_service';
import CookieService from '@/services/cookie_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type Analysis = {
  analysis_id: number;
  analysis_name: string;
}

type Submissions = {
    id: number;
    subStatus: string;
    submittedAt: number;
    altName: string;
    analysis: Analysis;
  }

/**
 * Component to display the list of submissions
 * @param {function} onClick
 * @constructor
 * @return {JSX.Element}
 */
export default function SubmissionList() {
  const [availableAnalyses, setAvailableAnalyses] = useState<Analysis[]>([]);
  const headers: GridColDef[] = [
    {
      field: 'altName',
      headerName: 'Submissions',
      flex: 2,
      filterable: false,
      sortable: false,
      groupable: false,
      renderCell: (params: any) => {
        const {value, id, row} = params;
        const {submittedAt} = row;
        if (value !== null &&
          value !== undefined &&
          value !== 'N/A' &&
          value.length > 0) {
          return (
            <div>
              <Checkbox
                edge="start"
                tabIndex={-1}
                disableRipple
                inputProps={{'aria-labelledby': id}}
              />
              {value}
            </div>
          );
        } else if ((id !== null &&
          id !== undefined) &&
      (submittedAt !== null &&
        submittedAt !== undefined)) {
          return (
            <div>
              <Checkbox
                edge="start"
                tabIndex={-1}
                disableRipple
                inputProps={{'aria-labelledby': params.id}}
              />
              {`Submission_${id}_${submittedAt}`}
            </div>
          );
        } else {
          return 'N/A';
        }
      },
    },
    {
      field: 'analysis',
      headerName: 'Tasks',
      flex: 1,
      filterable: false,
      sortable: false,
      groupable: false,
      renderCell: (params: any) => {
        const {value} = params;
        if (value !== null || value !== undefined) {
          return (
            <div className="">
              {value.analysis_name}
            </div>
          );
        } else {
          return 'N/A';
        }
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: false,
      sortable: false,
      groupable: false,
      headerClassName: 'text-center',
      renderCell: (params: any) => {
        const {value} = params;
        return (
          <div>
            {getIcon(value)}
          </div>
        );
      },
    },
    {
      field: 'submittedAt',
      headerName: 'Submission Date',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      valueGetter: (params: any) => {
        const formatDate = new Date(
            params
        ).toLocaleString('en-US');
        return params !== null && params !== undefined ? formatDate : 'N/A';
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params: any) => {
        return (
          <span className="standardLink">
              Coming Soon!
          </span>
        );
      },
    },
    {
      field: 'private_report',
      headerName: 'Private Report',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params: any) => {
        const {id} = params;
        const pub = false;
        if (id !== null && id !== undefined && id !== 'N/A') {
          return (
            <Link
              href={
                `/mysubmissions/private_report?sid=${id}&pub=${pub}`
              }
              className="standardLink">
        View Now
            </Link>
          );
        } else {
          return 'N/A';
        }
      },
    },
  ];
  const [submissions, setSubmissions] = useState<Submissions[]>([]);

  const onClick = (e) => {
    console.log('Clicked:', typeof(e.target.getAttribute('data-analysisId')));
    const analysisId = parseInt(e.target.getAttribute('data-analysisId'));
    const fetchSubmissions = async () => {
      const user = CookieService.getUserCookie();
      const userId = await UserService.getUserId(user.token);
      SubmissionService.getSelectedSubmissionsForUser(userId, analysisId)
          .then((fetchedSubmissions) => {
            // eslint-disable-next-line
            const formattedSubs = SubmissionService.formatAllSubmissionsForUser(fetchedSubmissions);
            setSubmissions(formattedSubs);
          })
          .catch((error) => {
            console.error('Error fetching submissions:', error);
          });
    };

    fetchSubmissions();
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      const user = CookieService.getUserCookie();
      const userId = await UserService.getUserId(user.token);
      SubmissionService.getAllSubmissionsForUser(userId)
          .then((fetchedSubmissions) => {
            // eslint-disable-next-line
            const formattedSubs = SubmissionService.formatAllSubmissionsForUser(fetchedSubmissions);
            setSubmissions(formattedSubs);
          })
          .catch((error) => {
            console.error('Error fetching submissions:', error);
          });
      AnalysisService.getAllAnalyses()
          .then((analyses) => {
            console.log('analyses: ', analyses);
            setAvailableAnalyses(analyses.data);
          })
          .catch((error) => {
            console.error('Error fetching analyses:', error);
          });
    };

    fetchSubmissions();
  }, []);

  const getIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return (<span className='pal-black'>
          Queued
        </span>);
      case 'running':
        return (<span className='pal-yellow'>
          In Progress
        </span>);
      case 'failed':
        return (<span className='pal-red'>
          Failed
        </span>);
      case 'finished':
        return (<span className='pal-green'>
          Success
        </span>);
      default:
        return null;
    }
  };

  return (
    <div className='
    min-w-full
    '>
      <h1 className='text-3xl font-bold text-center mb-5'>
        My Submissions
      </h1>
      <div className='flex justify-center'>
        <button
          className='
              smShadowed
              tableBorder
              bg-white
              p-1
              hover:bg-pal-500
          '
          data-analysisId={0}
          onClick={onClick}>
          All Submissions
        </button>
        {availableAnalyses.map((analysis) => {
          return (
            <button
              key={analysis.analysis_id}
              className='
              smShadowed
              tableBorder
              bg-white
              ml-3
              p-1
              hover:bg-pal-500
              '
              data-analysisId={analysis.analysis_id}
              onClick={onClick}>
              {analysis.analysis_name}
            </button>
          );
        })}
      </div>
      <div className='
    min-w-full
    bg-white
    tableBorder
    shadowed
    mt-5
    '>
        <DataGrid
          columns={headers}
          rows={Array.isArray(submissions) ? submissions : []}
          slots={{
            toolbar: GridToolbar,
          }}
          hideFooterPagination={true}
        />
      </div>
    </div>
  );
}
