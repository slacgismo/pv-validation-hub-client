import client from '@/services/api_service';

const AnalysisService = {
  getCardDetails(analysisId: number | string) {
    return client.get(`analysis/${analysisId}`);
  },
  getPythonVersions() {
    return client.get('/versions/python/');
  },
  uploadAlgorithm(
      analysisId: number,
      token: string,
      file: File,
      altName: string,
      pythonVersion: string,
  ) {
    if (analysisId !== null && analysisId !== undefined &&
          file !== null && file !== undefined && pythonVersion !== null &&
          pythonVersion !== undefined) {
      const url = `/submissions/analysis/${analysisId}/submission`;
      const formData = new FormData();

      // set authorization token
      client.defaults.headers.common.Authorization = `Token ${token}`;

      // analysis_id is the expected format on the backend
      formData.append('algorithm', file);
      formData.append('analysis_id', analysisId.toString()); // Convert analysisId to a string
      formData.append('python_version', pythonVersion);

      if ( typeof(altName) === 'string' &&
      altName !== undefined &&
      altName !== null &&
      altName.length > 0 ) {
        formData.append('alt_name', altName);
      } else {
        formData.append('alt_name', '');
      }

      // Return the Promise from client.post
      return client.post(url, formData, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // If analysisId or file is null or undefined, return a rejected Promise
    return Promise.reject(
        new Error('analysisId, pythonVersion and ' +
          'file cannot be null or undefined'));
  },
  getAllAnalyses() {
    return client.get('/analysis/home');
  },
};

export default AnalysisService;
