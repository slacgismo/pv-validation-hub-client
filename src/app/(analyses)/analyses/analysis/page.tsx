'use client';
// *********** START OF IMPORTS ***********

import React, {useState, useEffect} from 'react';
import {
  Box, Grid, Button, Tab, Tabs, Typography, CircularProgress,
} from '@mui/material';
import {Container} from '@mui/system';
import ReactModal from 'react-modal';
import Cookies from 'universal-cookie';
import {FileUploader} from 'react-drag-drop-files';
import {useRouter} from 'next/navigation';
import {useSearchParams} from 'next/navigation';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import TabPanel from '@/app/modules/analyses/tabpanel';
import Data from '@/app/modules/analyses/leaderboard/data';
import Leaderboard from '@/app/modules/analyses/leaderboard/leaderboard';
import Overview from '@/app/modules/analyses/leaderboard/overview';
import Rules from '@/app/modules/analyses/leaderboard/rules';
import AnalysisService from '@/services/analysis_service';
import replaceImagePaths from '@/config/mdurl';
import MS from '@/services/md_service';

// *********** REDUX IMPORTS ***********

import {useDispatch} from 'react-redux';

// *********** END OF IMPORTS ***********

type uploadSuccess = {
  success: boolean | null | 'emptyDisplay';
}

type fileObj = {
  file: File | null;
  name?: string;
}

type AnalysisDetailsCard = {
  analysisId: string | number;
  analysis_name: string;
}

const AnalysisPage: React.FC = () => {
  const searchParams = useSearchParams();
  const navigate = useRouter();
  const cookies = new Cookies();
  const user = cookies.get('user');
  const dispatch = useDispatch();

  if (searchParams.get('analysisId') === null) {
    console.error('Analysis ID not found');
    navigate.push('/analyses');
  }

  const selectedAnalysis: string | number = parseInt(
      searchParams.get('analysisId') || '', 10);

  const [value, setValue] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState<uploadSuccess>({
    success: null,
  });
  const [analysisId, setAnalysisId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisDetailsCard,
    setAnalysisDetailsCard] = useState<AnalysisDetailsCard>({
      analysisId: '',
      analysis_name: '',
    });

  const [isOpen, setIsOpen] = useState(false);

  // Set the md descriptions

  const [datasetDescription, setDatasetDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [rulesetDescription, setRulesetDescription] = useState('');
  const [coverImageDir, setCoverImageDir] = useState('');

  const [file, setFile] = useState<fileObj>({
    file: null,
    name: '',
  });

  useEffect(() => {
    AnalysisService.getCardDetails(selectedAnalysis)
        .then((response: any) => {
          setIsLoading(false);
          console.log('resp:', response.data);
          setAnalysisDetailsCard(response.data);
          setAnalysisId(response.data.analysis_id);
        })
        .catch((e: any) => {
          if (window.location.hostname.includes('localhost') && (
            analysisId === 'development'
          )) {
            setAnalysisDetailsCard({
              analysisId: 'development',
              analysis_name: 'Dev Analysis',
            });
            setAnalysisId('development');
            setIsLoading(false);
            console.log('Loading development analysis');
          } else {
            setError(e);
            console.error('Error:', error);
            setIsLoading(false);
            setAnalysisDetailsCard({
              analysisId: 'development',
              analysis_name: 'Dev Analysis',
            });
          }
        });
  }, [selectedAnalysis, dispatch, analysisId, error]);

  useEffect(() => {
    console.log('analysis', selectedAnalysis, typeof selectedAnalysis);
    if (selectedAnalysis !== undefined && selectedAnalysis !== null &&
            ((typeof(selectedAnalysis) === 'number' && selectedAnalysis > 0) ||
            (
              typeof(selectedAnalysis) === 'string' &&
              selectedAnalysis === 'development'
            ))) {
      setCoverImageDir(`/static/assets/${selectedAnalysis}/banner.png`);
      console.log('cid', coverImageDir);

      MS.fetchMarkdown(`/static/assets/${selectedAnalysis}/dataset.md`)
          .then((text) => setDatasetDescription(text))
          .catch((err) => console.log(err));

      MS.fetchMarkdown(`/static/assets/${selectedAnalysis}/description.md`)
          .then((text) => replaceImagePaths(text, selectedAnalysis))
          .then((text) => setLongDescription(text))
          .catch((err) => console.log(err));

      MS.fetchMarkdown(
          `/static/assets/${selectedAnalysis}/SubmissionInstructions.md`
      )
          .then((text) => replaceImagePaths(text, selectedAnalysis))
          .then((text) => setRulesetDescription(text))
          .catch((err) => console.log(err));
    } else {
      console.error('Analysis ID not found');
    }
  }, [selectedAnalysis, coverImageDir]);

  const closeModal = () => {
    setIsOpen(false);
    setUploadSuccess({
      'success': 'emptyDisplay',
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  // lmao, you can't use "tar.gz", only "gz", anything after the last "." works
  const fileTypes = ['ZIP', 'GZ'];

  const uploadFile = (fileObject: File) => {
    setFile({
      file: fileObject,
    });
  };

  const handleUpload = () => {
    let responsePromise;
    if (typeof(analysisId) === 'number' && file.file !== null) {
      responsePromise = AnalysisService.uploadAlgorithm(
          analysisId,
          user.token,
          file.file);
    } else if (analysisId === 'development') {
      responsePromise = Promise.resolve({
        status: 200,
      });
      console.log('Dev Analysis Mode');
    } else {
      responsePromise = Promise.reject(new Error('Analysis ID not found'));
    }

    responsePromise
        .then((response) => {
          console.log('response:', response);
          if (response.status === 200) {
            setUploadSuccess({
              success: true,
            });
            setFile({
              file: null,
            });
          } else {
            setUploadSuccess({
              success: false,
            });
          }
        })
        .catch((errorCode) => {
          console.error('Upload failed:', errorCode);
          setUploadSuccess({
            success: false,
          });
        });
  };

  const handleActive = () => file !== null;

  const handleClear = () => setFile({
    file: null,
  });

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="mainElement" className="flex min-h-screen flex-col
    items-center justify-between p-24">
        {
            isLoading !== false ? <CircularProgress /> :
            (
              <Container id="analysis">
                <Box sx={{
                  flexGrow: 1,
                  marginTop: 3,
                  height: 200,
                  backgroundImage: `url(${coverImageDir})`,
                }}
                >
                  <Box sx={{flexGrow: 1, marginTop: 4, marginLeft: 2}}>
                    <Typography color="black" variant="h4" gutterBottom>
                      {analysisDetailsCard.analysis_name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{width: '100%'}}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      marginRight: 2,
                    }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={10}>
                        <Tabs
                          value={value}
                          onChange={handleChange}
                          aria-label="basic tabs example"
                        >
                          <Tab label="Overview" />
                          <Tab label="Data" />
                          <Tab label="Leaderboard" />
                          <Tab label="Instructions" />
                          {
                            // <Tab label="Discussion" />
                          }
                        </Tabs>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (user === undefined || user === null) {
                              navigate.push('/login');
                            }
                            openModal();
                          }}
                          sx={{
                            backgroundColor: 'black',
                            width: '100%',
                            height: '70%',
                            marginTop: 1,
                          }}
                        >
                          <Typography >
                            Upload Algorithm
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  <TabPanel value={value} index={0}>
                    <Overview
                      title={`Overview of ${analysisDetailsCard.analysis_name}`}
                      description={longDescription}
                    />
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                                    (
                    <Data
                      dataDescription={datasetDescription}
                      downloadableLink={null}
                    />
                                    )
                  </TabPanel>

                  <TabPanel value={value} index={2}>
                    <Leaderboard />
                  </TabPanel>

                  <TabPanel value={value} index={3}>
                    <Rules
                      title={analysisDetailsCard.analysis_name}
                      description={rulesetDescription}
                    />
                  </TabPanel>
                </Box>

                <ReactModal
                  isOpen={isOpen}
                  contentLabel="Upload Algorithm"
                  ariaHideApp={false}
                  parentSelector={() => (
                    document.querySelector('#mainElement') as HTMLElement
                  )}
                >
                  <Box sx={{
                    top: '50%',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <Typography sx={{marginLeft: 10}} variant="h5">
                          PVHub Algorithm Upload
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Button onClick={closeModal}>Exit</Button>
                      </Grid>
                    </Grid>
                    <Box sx={{marginTop: 2, marginBottom: 2}}>
                      <FileUploader
                        multiple={false}
                        handleChange={uploadFile}
                        name="file"
                        types={fileTypes}
                      />
                    </Box>
                    <Typography
                      sx={{marginLeft: 20}}
                      color="gray"
                      variant="body1">
                      {file ? `File name: ${file.name}` :
                      'No files staged for upload yet.'}
                    </Typography>
                    {uploadSuccess.success === true && (
                      <Typography color="green" variant="body1">
                      Upload Successful! Please check your developer
                      page for the status of your upload,
                      or upload another file.
                      </Typography>
                    )}
                    {uploadSuccess.success === false && (
                      <Typography color="red" variant="body1">
                      Upload failed. Please reload the page and try again.
                      If you continue to receive issues with the upload,
                      please file an issue at our github page,
                        {' '}
                        {/* eslint-disable-next-line max-len */}
                        <a href="https://github.com/slacgismo/pv-validation-hub">https://github.com/slacgismo/pv-validation-hub</a>
                      .
                      </Typography>
                    )}
                    <Button
                      disabled={!handleActive()}
                      variant="contained"
                      onClick={handleUpload}>
                      Upload
                    </Button>
                    <Button
                      disabled={!handleActive()}
                      variant="contained"
                      onClick={handleClear}>
                      Clear
                    </Button>
                  </Box>
                </ReactModal>
              </Container>
            )
        }
      </main>
      <Footer />
    </div>
  );
};


export default AnalysisPage;
