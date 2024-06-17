// *********** START OF IMPORTS ***********

import React from 'react';
import {Typography} from '@mui/material';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import DemoBoard from '@/app/modules/homepage/demoTable';

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
      <main className="flex min-h-screen min-w-screen flex-col
    items-center justify-between p-24">
        <div className="flex flex-col items-center">
        </div>
        <div className='grid grid-cols-2 gap-4 justify-center content-center'>
          <div className="m-2
          flex
          flex-column
          shadow tableBorder
          bg-white
          completeFit
          justify-center">
            <DemoBoard />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-row">
              <Typography variant="h1" className="
              text-5xl
              font-bold
              sTextColor">
           PV-
              </Typography>
              <Typography variant="h1" className="text-5xl font-bold">
           Validation Hub!
              </Typography>
            </div>
            <p className="text-lg mt-4 pl-36 items-center">
            Helping developers to validate their pv science algorithms,
            and helping analysts select algorithms for use in their pipelines
            </p>
          </div>
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
