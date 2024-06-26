import {useEffect, useState} from 'react';
import client from '@/services/api_service';

const DashboardService = {
  formatResponse(response: any) {
    const finalResponse = [];
    let id = 0;
    console.log('Printing response');
    console.log(response);
    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        const formattedSubmittedAt = new Date(
            response[i].submitted_at
        ).toLocaleString('en-US');

        const element = {
          id,
          file_completion: response[i].error_rate,
          created_by: response[i].created_by.username,
          execution_time: response[i].mrt,
          status: response[i].status,
          metrics: response[i].data_requirements,
          error: response[i].mae,
          submitted_at: formattedSubmittedAt,
        };
        id += 1;
        console.log('id:', id);
        console.log('ele', element);
        finalResponse.push(element);
      }
    }
    console.log(finalResponse);
    return finalResponse;
  },
  useGetAnalysisSet(analysisUrl: string) {
    const [analysesDetails, setAnalysesDetails] = useState<{
      analysis_id: number | string,
      analysis_name: string }[]>([]);
    const [isAnalysesLoading, setAnalysesIsLoading] = useState(true);
    const [analysesError, setAnalysesError] = useState(null);

    useEffect(() => {
      client.get(analysisUrl)
          .then((analysisResponse) => {
            setAnalysesIsLoading(false);
            setAnalysesDetails(analysisResponse.data);
          })
          .catch((error) => {
            if (window.location.hostname.includes('localhost') &&
            (analysesDetails.length === 0 ||
                        analysesDetails[0].analysis_id === 'development')) {
              setAnalysesDetails([{
                analysis_id: 'development',
                analysis_name: 'Dev Analysis',
              }]);
              setAnalysesIsLoading(false);
              console.log('Using development analysis');
            } else {
              setAnalysesError(error);
              setAnalysesDetails([]);
              setAnalysesIsLoading(false);
            }
          });
      // eslint-disable-next-line
    }, [analysisUrl]);
    return [isAnalysesLoading, analysesError, analysesDetails];
  },
  getLeaderBoard(leaderBoardUrl: string) {
    console.log(leaderBoardUrl);
    return client.get(leaderBoardUrl);
  },
  useGetSubmissions(submissionUrl: string, token: string) {
    const [isSubmissionLoading, setSubmissionLoading] = useState(true);
    const [submissionError, setSubmissionError] = useState(null);
    const [submissionData, setSubmissionData] = useState(null);

    // set authorization token
    client.defaults.headers.common.Authorization = `Token ${token}`;

    useEffect(() => {
      client.get(submissionUrl)
          .then((submissionResponse) => {
            setSubmissionLoading(false);
            const response = JSON.parse(
                JSON.stringify(submissionResponse.data));
            setSubmissionData(response);
          })
          .catch((error) => {
            setSubmissionLoading(true);
            setSubmissionError(error);
          });
    }, [submissionUrl]);
    return [isSubmissionLoading, submissionError, submissionData];
  },
};

export default DashboardService;
