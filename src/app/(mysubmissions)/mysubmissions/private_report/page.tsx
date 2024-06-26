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

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type ErrorData = {
  error_rate?: string;
  error_code?: string;
  error_type?: string;
  error_message?: string;
}

// eslint-disable-next-line
type SubmissionData = {
  submitted_at: string;
}

const PrivateReportPage: React.FC = () => {
  const searchParams = useSearchParams();
  const selectedSubmission = searchParams.get('sid') || 'development';
  const [marimoUrl, setMarimoUrl] = useState('');
  const [errorData, setErrorData] = useState<ErrorData>({
    error_rate: '0%',
    error_code: '',
    error_type: '',
    error_message: '',
  });
  const [displayErrorDetails, setDisplayErrorDetails] = useState(false);

  useEffect(() => {
    const fetchSubmissionErrors = async () => {
      if (selectedSubmission === 'development') {
        setErrorData({
          error_rate: '0%',
          error_code: 'OP Development',
          error_type: 'Example Error Type',
          error_message: 'This is a message. I like messages.',
        });
        setDisplayErrorDetails(true);
      } else {
        try {
          const errors = await
          SubmissionService.getSubmissionErrors(parseInt(selectedSubmission));
          console.log('Error data:', errors);
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

    const fetchSubmissionResults = async () => {
      const num = parseInt(selectedSubmission);
      if (typeof(num) !== 'number') {
        setMarimoUrl('/static/template.html');
      } else {
        SubmissionService.getSubmissionResults(num)
            .then((response) => response.data)
            .then((result) => {
              if (result === 'Invalid submission ID') {
                console.error('Invalid submission ID');
              } else {
                setMarimoUrl(result.marimo_url[0]);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <div>
          <Box sx={{flexGrow: 1}}>
            <AppBar
              position="static"
              className="items-center"
            >
              <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            Error Rate:
                {' '}
                {errorData.error_rate}
              </Typography>
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

          <Suspense fallback={<CircularProgress />}>
            <MarimoProcessor htmlFile={marimoUrl} />
          </Suspense>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivateReportPage;
