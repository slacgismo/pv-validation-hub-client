// *********** START OF IMPORTS ***********

import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import React from 'react';
import {ReduxProvider} from './modules/provider';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

const inter = new (Inter as any)({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'PV Validation Hub',
  description: 'Your one-stop shop for PV validation, ranking, and more.',
};

/**
 * The RootLayout component is the root layout of the app.
 * It wraps the app in the HTML and body tags.
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
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
