'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import Link from 'next/link';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import {useSearchParams} from 'next/navigation';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

const LogoutPage: React.FC = (props) => {
  const searchParams = useSearchParams();
  const extURL = searchParams.get('exturl') || '';
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <div>You have selected a link that is navigating
        you away from pv-validation-hub.org</div>
        <div>The link is for: {extURL}</div>
        <Link href={extURL} />

        <div>You can return to the main page by clicking the link below:</div>
        <Link href={'/'}>Return to main page</Link>
      </main>
      <Footer />
    </div>
  );
};

export default LogoutPage;
