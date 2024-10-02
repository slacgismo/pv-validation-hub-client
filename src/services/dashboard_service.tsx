import {useEffect, useState} from 'react';
import client from '@/services/api_service';

const DashboardService = {
  formatResponse(response: any) {
    const finalResponse = [];
    let id = 0;
    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        const formattedSubmittedAt = new Date(
            response[i].submitted_at
        ).toLocaleString('en-US');

        const element: any = {
          id,
          file_completion: response[i].error_rate,
          created_by: response[i].created_by.username,
          execution_time: response[i].mrt,
          status: response[i].status,
          dataRequirements: response[i].data_requirements,
          error: null,
          submitted_at: formattedSubmittedAt,
          python_version: response[i].python_version,
        };
        const keys = Object.keys(response[i].result);
        const resObj = response[i].result;
        if (keys.length > 0) {
          for (const key in resObj) {
            // writing style workaround, I DO want all the keys
            if (key in resObj) {
              element[key] = resObj[key];
            }
          }
        }
        id += 1;
        finalResponse.push(element);
      }
    }
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
            if (window.location.hostname.includes('127.0.0.1') &&
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
    return client.get(leaderBoardUrl);
  },
  getAnalysisDetails(analysisId: number) {
    return client.get(`/analysis/${analysisId}`);
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
