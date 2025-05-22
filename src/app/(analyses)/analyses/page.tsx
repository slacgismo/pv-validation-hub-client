'use client';
// *********** START OF IMPORTS ***********

import React, {useState, useEffect} from 'react';
import {
  Box, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {Container} from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';
import {useRouter} from 'next/navigation';


// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import MS from '@/services/md_service';
import DashboardService from '@/services/dashboard_service';
import CustomizedCard from '@/app/modules/analyses/customcard';

// *********** REDUX IMPORTS ***********

import {useDispatch} from 'react-redux';
import {setSelectedAnalysis} from '@/reducers/curAnalysis';
import {useAppSelector} from '@/store/store';

// *********** END OF IMPORTS ***********


const AnalysesPage: React.FC = () => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const selectedAnalysis = useAppSelector(
      (state) => state.curAnalysis.selectedAnalysis
  );
  const [analysesBlurb, setAnalysesBlurb] = useState('');

  useEffect(() => {
    MS.fetchMarkdown('/static/assets/blurbs/analyseshome.md')
        .then((text) => {
          setAnalysesBlurb(text);
        })
        .catch((error) => console.error(error));
  }, [selectedAnalysis, navigate]);

  // Use dispatch to update selectedAnalysis
  const handleAnalysisSelection = (analysisId: string | number) => {
    dispatch(setSelectedAnalysis(analysisId));
    navigate.push(`/analyses/analysis?analysisId=${analysisId}`);
  };


  const [
    isLoading,
    // eslint-disable-next-line no-unused-vars
    isError,
    cardDetails,
  ] = DashboardService.useGetAnalysisSet('/analysis/home');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <Container>
          <Box sx={{flexGrow: 1, marginTop: 3}}>
            <Typography variant="h2" gutterBottom>
          Analytical Tasks
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item>
              <Box sx={{flexGrow: 1, marginTop: 3}}>
                <Typography
                  variant="body1"
                  gutterBottom
                  className='reactMarkdown'>
                  {analysesBlurb}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{flexGrow: 1, marginTop: 3, marginBottom: 10}}>
            {
                    isLoading ?
                      (
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                          <CircularProgress />
                        </Box>
                      ) :
                      (
                        <Grid container spacing={{xs: 2, md: 3}}
                          columns={{xs: 4, sm: 8, md: 12}}
                          alignItems="stretch">
                          {
                            Array.isArray(cardDetails) &&
                            cardDetails.map((card, index) => {
                              const newKey = `${card.analysis_id}-${index}`;
                              return (
                                <CustomizedCard
                                  key={newKey}
                                  index={index}
                                  card={card}
                                  onClick={handleAnalysisSelection}
                                  testId={`analysis-card${index}`}
                                />
                              );
                            })
                          }
                        </Grid>
                      )
            }
          </Box>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default AnalysesPage;
