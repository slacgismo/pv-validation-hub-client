'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Header />
      <h1>Welcome to the profile page!</h1>
      <Footer />
    </div>
  );
};

export default ProfilePage;
