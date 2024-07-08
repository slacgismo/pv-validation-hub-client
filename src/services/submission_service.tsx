import client from '@/services/api_service';

const SubmissionService = {
  getAllSubmissionsForUser(userId: number) {
    if (typeof(userId) === 'string') {
      throw new Error('Invalid user ID');
    }
    // 0 is the analysis ID for all submissions
    return client.get(`/submissions/user/${userId}/submissions/0`)
        .then((response) => response.data);
  },
  getAvailableAnalyses() {
    return client.get('/analyses')
        .then((response) => response.data);
  },
  getSelectedSubmissionsForUser(userId: number, analysisId: number) {
    if (typeof(userId) === 'string') {
      throw new Error('Invalid user ID');
    }
    if (typeof(analysisId) === 'string') {
      throw new Error('Invalid analysis ID');
    }
    return client.get(`/submissions/user/${userId}/submissions/${analysisId}`)
        .then((response) => response.data);
  },
  formatAllSubmissionsForUser(response: any) {
    const finalResponse = [];
    console.log('Printing response');
    console.log(response);
    if (response.length > 0) {
      for (let i = 0; i < response.length; i += 1) {
        const element = {
          id: response[i].submission_id,
          status: response[i].status,
          submittedAt: response[i].submitted_at,
          altName: response[i].alt_name,
          subStatus: response[i].status,
          analysis: response[i].analysis,
        };
        finalResponse.push(element);
      }
    }
    console.log(finalResponse);
    return finalResponse;
  },
  getSubmissionResults(submissionId: number | string) {
    if (typeof(submissionId) === 'string') {
      throw new Error('Invalid submission ID');
    }
    return client.get(`/submissions/submission_results/${submissionId}`);
  },
  getSubmissionErrors(submissionId: number | string) {
    if (typeof(submissionId) === 'string') {
      return 'Invalid submission ID';
    }
    return client.get(`/error/error_report/private/${submissionId}`)
        .then((response) => response.data);
  },
};

export default SubmissionService;
