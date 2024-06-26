'use client';

const ENVIRONMENT_DEVELOPMENT = 'DEVELOPMENT';
const ENVIRONMENT_STAGING = 'STAGING';
const ENVIRONMENT_PRODUCTION = 'PRODUCTION';

const BASE_API_URL_APP_DEVELOPMENT = 'http://localhost:8005';
const BASE_API_URL_APP_STAGING = 'https://api-staging.pv-validation-hub.org';
const BASE_API_URL_APP_PRODUCTION = 'https://api.pv-validation-hub.org';

const parseEnvironment = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('localhost')) {
      return ENVIRONMENT_DEVELOPMENT;
    }
    if (window.location.hostname.includes('staging')) {
      return ENVIRONMENT_STAGING;
    }
    return ENVIRONMENT_PRODUCTION;
  } else {
    // During the build process, use process.env.NODE_ENV to determine the environment
    switch (process.env.NODE_ENV) {
      case 'development':
        return ENVIRONMENT_DEVELOPMENT;
      case 'production':
        return ENVIRONMENT_PRODUCTION;
      default:
        return ENVIRONMENT_PRODUCTION;
    }
  }
};

export const ENVIRONMENT = parseEnvironment();
export const isDevelopment = () => (ENVIRONMENT === ENVIRONMENT_DEVELOPMENT);
export const isStaging = () => (ENVIRONMENT === ENVIRONMENT_STAGING);
export const isProduction = () => (ENVIRONMENT === ENVIRONMENT_PRODUCTION);

let baseApiUrlApp;
if (isDevelopment()) baseApiUrlApp = BASE_API_URL_APP_DEVELOPMENT;
else if (isStaging()) baseApiUrlApp = BASE_API_URL_APP_STAGING;
else if (isProduction()) baseApiUrlApp = BASE_API_URL_APP_PRODUCTION;

const hubapi = {
  api: {
    defaultTimeout: 60000,
    baseUrl: {
      app: baseApiUrlApp,
    },
  },
};

export default hubapi;
