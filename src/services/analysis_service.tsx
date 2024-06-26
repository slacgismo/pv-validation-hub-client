import client from '@/services/api_service';

const AnalysisService = {
  getCardDetails(analysisId: number | string) {
    return client.get(`analysis/${analysisId}`);
  },
  uploadAlgorithm(
      analysisId: number,
      token: string,
      file: File,
      altName: string) {
    if (analysisId !== null && analysisId !== undefined &&
          file !== null && file !== undefined) {
      const url = `/submissions/analysis/${analysisId}/submission`;
      const formData = new FormData();

      // set authorization token
      client.defaults.headers.common.Authorization = `Token ${token}`;

      // analysis_id is the expected format on the backend
      formData.append('algorithm', file);
      formData.append('analysis_id', analysisId.toString()); // Convert analysisId to a string

      console.log('outside: ', altName);
      if ( typeof(altName) === 'string' &&
      altName !== undefined &&
      altName !== null &&
      altName.length > 0 ) {
        console.log(altName);
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
        new Error('analysisId and file cannot be null or undefined'));
  },
};

export default AnalysisService;
