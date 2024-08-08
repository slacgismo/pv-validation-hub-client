'use client';
// *********** START OF IMPORTS ***********

import React, {useEffect, useState, Suspense} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {useSearchParams} from 'next/navigation';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import SubmissionService from '@/services/submission_service';
// eslint-disable-next-line max-len
import MarimoProcessor from '@/app/modules/mysubmissions/marimo/marimoprocessor';
import {EditableInput} from '@/app/modules/global/editableComponents';
import UserService from '@/services/user_service';
import CookieService from '@/services/cookie_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type ErrorData = {
  error_rate?: string;
  error_code?: string;
  error_type?: string;
  error_message?: string;
}

type SubmissionData = {
  submissionId: number;
  submittedAt: string;
  altName: string;
  dataRequirements: string[];
  mrt: number;
  pythonVersion: string;
  results: any;
  workerVersion: number;
  status: string;
}

const PrivateReportPage: React.FC = () => {
  const searchParams = useSearchParams();
  const selectedSubmission = searchParams.get('sid') || 'development';
  const [marimoUrl, setMarimoUrl] = useState('');
  const [errorData, setErrorData] = useState<ErrorData>({
    error_rate: '0',
    error_code: '',
    error_type: '',
    error_message: '',
  });
  const [displayErrorDetails, setDisplayErrorDetails] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    submissionId: 0,
    submittedAt: '',
    altName: '',
    dataRequirements: [],
    mrt: 0,
    pythonVersion: '',
    results: {},
    workerVersion: 0,
    status: '',
  });
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

  const handleNameChange = (newValue: string) => {
    setSubmissionData((prevSubmissionData) => ({
      ...prevSubmissionData,
      altName: newValue,
    }));
  };

  const handleSetName = async (newValue: string) => {
    const user = CookieService.getUserCookie();
    const userId = await UserService.getUserId(user.token);
    await SubmissionService.updateName(
        user.token,
        userId,
        submissionData.submissionId,
        newValue);
  };

  const onChange = (newValue: string) => {
    setIsEditing((prev) => ({...prev, [submissionData.submissionId]: true}));
    handleNameChange(newValue);
  };

  const onClick = () => {
    setIsEditing((prev) => ({...prev, [submissionData.submissionId]: false}));
    handleSetName(submissionData.altName);
  };

  const getDisplayName = () => {
    const {altName, submissionId, submittedAt} = submissionData;

    if (altName !== null &&
      altName !== undefined &&
      altName !== 'N/A' &&
      (altName.length > 0 || isEditing[submissionId])) {
      return altName;
    } else if (submissionId !== null &&
      submissionId !== undefined &&
      submittedAt !== null && submittedAt !== undefined) {
      return `Submission_${submissionId}_${submittedAt}`;
    } else {
      return 'N/A';
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return (<span className='pal-black'>
        Status:  Queued
        </span>);
      case 'running':
        return (<span className='pal-yellow'>
        Status:  In Progress
        </span>);
      case 'failed':
        return (<span className='pal-red'>
        Status:  Failed
        </span>);
      case 'finished':
        return (<span className='pal-green'>
        Status:  Success
        </span>);
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchSubmissionErrors = async () => {
      if (selectedSubmission === 'development') {
        setErrorData({
          error_rate: '0',
          error_code: 'OP Development',
          error_type: 'Example Error Type',
          error_message: 'This is a message. I like messages.',
        });
        setDisplayErrorDetails(true);
      } else {
        try {
          const errors = await
          SubmissionService.getSubmissionErrors(parseInt(selectedSubmission));
          if (errors === 'Invalid submission ID') {
            console.error('Invalid submission ID');
          } else if (errors.length === 0) {
            setErrorData({error_rate: '0%'});
            setDisplayErrorDetails(false);
          } else if (errors.length > 0) {
            let tempErrorData = errors[0];
            if (tempErrorData.error_type.toLowerCase().includes(
                'operation'.toLowerCase()) ||
            tempErrorData.error_type.toLowerCase().includes(
                'wrapper'.toLowerCase()) ||
            tempErrorData.error_type.toLowerCase().includes(
                'worker'.toLowerCase())) {
              tempErrorData = {...tempErrorData, error_rate: 'N/A'};
            }
            setErrorData(tempErrorData);
            setDisplayErrorDetails(true);
          }
        } catch (error) {
          console.error('Error fetching submission results:', error);
        }
      }
    };

    /*
    result.submission_details
    {
    alt_name: "abcd"

archived: false

created_by: Object { uuid: 9, username: "MikeSloth" }

data_requirements: Array(4) [ "time_series", "latitude", "longitude", … ]

mrt: 16.30142615099976

python_version: "3.11"

result: Object { mean_run_time: 16.30142615099976, mean_mean_absolute_error: 46.332131163990425, median_mean_absolute_error: 0.20766129032258066 }

submission_id: 41

submitted_at: "2024-08-07T18:22:32.251191Z"

worker_version: 1}
    */
    const fetchSubmissionResults = async () => {
      const num = parseInt(selectedSubmission);
      if (typeof(num) !== 'number') {
        setMarimoUrl('/static/template.html');
      } else {
        SubmissionService.getSubmissionResults(num)
            .then((response) => response.data)
            .then((result) => {
              console.log('result:', result);
              if (result === 'Invalid submission ID') {
                console.error('Invalid submission ID');
              } else {
                setMarimoUrl(result.marimo_url[0]);
                setSubmissionData({
                  submissionId: result.submission_details.submission_id,
                  submittedAt: result.submission_details.submitted_at,
                  altName: result.submission_details.alt_name,
                  dataRequirements: result.submission_details.data_requirements,
                  mrt: result.submission_details.mrt,
                  pythonVersion: result.submission_details.python_version,
                  results: result.submission_details.result,
                  workerVersion: result.submission_details.worker_version,
                  status: result.submission_details.status,
                });
              }
            })
            .catch((error) => {
              console.error('Error fetching submission results:', error);
            });
      }
    };

    fetchSubmissionResults();
    fetchSubmissionErrors();
  }, [selectedSubmission]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <div
          className="
        items-center
        justify-center
        text-center
        content-center
        flex
        flex-col
        ">
          <Box sx={{flexGrow: 1}}>
            <AppBar
              position="static"
              className="
              items-center
              bg-white
              pal-black
              mb-4
              flex
              flex-row
              "
            >
              <div
                className="
                flex
                flex-row
                flex-1
                self-start
                text-lg
                font-medium
                underline
                ">
                <EditableInput
                  value={getDisplayName()}
                  onChange={(e) => onChange(e.target.value)}
                  onClick={onClick}
                />
              </div>
              <div
                className="
                flex
                flex-row
                mr-2
                self-end
                ">
                <button>logs inquiry</button>
              </div>
            </AppBar>
            <AppBar
              position="static"
              className="
              items-center
              bg-pal-pastel
              pal-black
              mb-4
              "
            >
              {submissionData && (
                <Box
                  sx={{padding: 2}}
                  className="
                flex
                flex-row
                ">
                  <div
                    className="
                  border-r
                  pr-2
                  ">
                    {submissionData.status === 'finished' ?
                      `Success Rate: ${100 - parseInt(
                          errorData.error_rate || '0')}%` :
                      getIcon(submissionData.status)}
                  </div>
                  <div
                    className="
                  border-r
                  pr-2
                  pl-1
                  ">
                    Date: {formatDate(submissionData.submittedAt)}
                  </div>
                  <div
                    className="
                  border-r
                  pr-2
                  pl-1
                  ">
                    MRT: {submissionData.mrt}
                  </div>
                  <div
                    className="
                  border-r
                  pr-2
                  pl-1
                  ">
                    Results: {submissionData.results &&
                              Object.keys(submissionData.results).length > 0 ?
                                Object.entries(submissionData.results)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(', ') :
                                'No results available'}
                  </div>
                  <div
                    className="
                  pl-1
                  ">
                    Data Requirements:{' '}
                    {submissionData.dataRequirements.join(', ')}
                  </div>
                </Box>
              )}
            </AppBar>
            <AppBar
              position="static"
              className="
              items-center
              bg-pal-pastel
              pal-black
              ">
              {displayErrorDetails && (
                <>
                  <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Error Code:
                    {' '}
                    {errorData.error_code}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Error Type:
                    {' '}
                    {errorData.error_type}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Error Message:
                    {' '}
                    {errorData.error_message}
                  </Typography>
                </>
              )}
            </AppBar>
          </Box>

          {
          (submissionData.status !== 'finished') ?
          <div>
          </div> : <Suspense fallback={<CircularProgress />}>
            <MarimoProcessor htmlFile={marimoUrl} />
          </Suspense>
          }

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivateReportPage;
