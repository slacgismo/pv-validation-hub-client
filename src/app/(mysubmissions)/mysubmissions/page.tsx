'use client';
// *********** START OF IMPORTS ***********

import React, {useEffect} from 'react';
import {Container} from '@mui/system';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import SubmissionList from '@/app/modules/mysubmissions/reportItem';

// *********** REDUX IMPORTS ***********

import {useDispatch} from 'react-redux';
import {setSelectedSubmission} from '@/reducers/curSubmission';

// *********** END OF IMPORTS ***********


const MySubmissionsPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedSubmission(''));
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <Container sx={{position: 'absolute'}}>
          <Box
            component="main"
            display="flex"
          >
            <Toolbar />
            <SubmissionList />
          </Box>
        </Container>
      </main>
      <Footer />
    </div>
  );
};


export default MySubmissionsPage;
