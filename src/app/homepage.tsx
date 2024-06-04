// *********** START OF IMPORTS ***********

import React from 'react';
import {Typography} from '@mui/material';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * The Home component is the main page of the app.
 * It displays a welcome message and a link to Vercel's website.
 * @return {JSX.Element} The rendered Home component.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <div className="flex flex-col items-center">
          <Typography variant="h1" className="text-5xl font-bold">
          Welcome to the PV Validation Hub!
          </Typography>
          <Typography variant="h3" className="text-2xl mt-4">
          A place for PV validation resources.
          </Typography>
        </div>
        <div>
          <p className="text-lg mt-4">
            Other blurbs about the PV Validation Hub.
          </p>
        </div>
        <div>
          <p className="text-lg mt-4">
            carousel here
          </p>
        </div>

      </main>
      <Footer />
    </div>
  );
}
