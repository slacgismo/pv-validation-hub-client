// *********** START OF IMPORTS ***********

import type {Metadata} from 'next';
import './globals.css';
import React, {Suspense} from 'react';
import {ReduxProvider} from './modules/provider';
import CircularProgress from '@mui/material/CircularProgress';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

export const metadata: Metadata = {
  title: 'PV Validation Hub',
  description: 'Your one-stop shop for PV validation, ranking, and more.',
};

/**
 * The RootLayout component is the root layout of the app.
 * It wraps the app in the HTML and body tags.
 * Susepense is required here due to whole pages dependant on useSearchParams.
 * @param {Readonly<{children: React.ReactNode}>} props The props of the RootLayout component.
 * @return {JSX.Element} The RootLayout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='theme-light'>
        <ReduxProvider>
          <Suspense fallback={<CircularProgress />}>
            {children}
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
