'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

const MySubmissionsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <h1>Welcome to the developer page!</h1>
      </main>
      <Footer />
    </div>
  );
};

export default MySubmissionsPage;
