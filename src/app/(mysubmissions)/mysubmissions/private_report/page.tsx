'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

const PrivateReportPage: React.FC = () => {
  return (
    <div>
      <Header />
      <h1>Welcome to the private report page!</h1>
      <Footer />
    </div>
  );
};

export default PrivateReportPage;
