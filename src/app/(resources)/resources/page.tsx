'use client';
// *********** START OF IMPORTS ***********

import React from 'react';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import Elink from '@/app/modules/elink/elink';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

const ResourcesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <h1>Welcome to the resources page!</h1>
        <Elink url='https://slac.stanford.edu' />
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
