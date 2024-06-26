'use client';
// *********** START OF IMPORTS ***********

import React, {useEffect} from 'react';
import {Container} from '@mui/system';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';

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
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={3}>
              <Box
                component="nav"
                aria-label="mailbox folders"
                sx={{position: 'fixed', display: 'flex'}}>
                <Drawer
                  variant="permanent"
                  sx={{
                    top: '10%',
                    border: '1px solid rgba(0, 0, 0, 0.12)'}}
                  open
                >
                  <Toolbar />
                </Drawer>
              </Box>
            </Grid>

            <Grid item xs={9} style={{marginTop: '2%'}}>
              <Box
                component="main"
                display="flex"
              >
                <Toolbar />
                <SubmissionList />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </main>
      <Footer />
    </div>
  );
};


export default MySubmissionsPage;
