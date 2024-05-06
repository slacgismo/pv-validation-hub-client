import {useEffect, useState} from 'react';
import client from './api_service.js';

const DashboardService = {
  formatResponse(response: any) {
    const finalResponse = [];
    let id = 0;
    console.log('Printing response');
    console.log(response);
    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        const element = {
          id,
          error_rate: response[i].error_rate,
          created_by: response[i].created_by.username,
          execution_time: response[i].mrt,
          status: response[i].status,
          metrics: response[i].data_requirements,
          error: response[i].mae,
        };
        id += 1;
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
  useGetLeaderBoard(leaderBoardUrl: string) {
    console.log(leaderBoardUrl);
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
    const [leaderboardError, setLeaderboardError] = useState(null);

    useEffect(() => {
      client.get(leaderBoardUrl)
          .then((leaderboardResponse) => {
            setLeaderboardIsLoading(false);
            setLeaderboardDetails(
                this.formatResponse(leaderboardResponse.data));
          })
          .catch((error) => {
            setLeaderboardError(error);
            setLeaderboardDetails([]);
            setLeaderboardIsLoading(false);
          });
    }, [leaderBoardUrl]);
    return [isLeaderboardLoading, leaderboardError, leaderboardDetails];
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
