'use client';


const baseApiUrlApp = process.env.NEXT_PUBLIC_API_URL || '';

if (!baseApiUrlApp) {
  throw new Error('Please define the NEXT_PUBLIC_API_URL environment variable');
}


const hubapi = {
  api: {
    defaultTimeout: 60000,
    baseUrl: {
      app: baseApiUrlApp,
    },
  },
};

export default hubapi;
