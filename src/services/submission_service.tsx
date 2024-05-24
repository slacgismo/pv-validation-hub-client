import client from '@/services/api_service';

const SubmissionService = {
  getAllSubmissionsForUser(userId: number) {
    if (typeof(userId) === 'string') {
      throw new Error('Invalid user ID');
    }
    return client.get(`/submissions/user/${userId}/submissions`)
        .then((response) => response.data);
  },
  getSubmissionResults(submissionId: number | string) {
    if (typeof(submissionId) === 'string') {
      return 'Invalid submission ID';
    }
    return client.get(`/submissions/submission_results/${submissionId}`)
        .then((response) => response.data);
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
