'use client';
// *********** START OF IMPORTS ***********

import React, {useState} from 'react';
import {
  Box, Grid, Button, Typography,
} from '@mui/material';
import Cookies from 'universal-cookie';
import {FileUploader} from 'react-drag-drop-files';

// *********** MODULE IMPORTS ***********

import AnalysisService from '@/services/analysis_service';
import Elink from '@/app/modules/elink/elink';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type uploadSuccess = {
    success: boolean | null | 'emptyDisplay';
  }

  type fileObj = {
    file: File | null;
    name?: string;
  }

/**
 *
 * @return {JSX.Element} Submit Algorithm file upload tab
 */
export default function SubmissionUploader(
    {analysisId}: {analysisId: number | string}
) {
  const cookies = new Cookies();
  const user = cookies.get('user');

  const [uploadSuccess, setUploadSuccess] = useState<uploadSuccess>({
    success: null,
  });

  const [file, setFile] = useState<fileObj>({
    file: null,
    name: '',
  });

  const [altName, setAltName] = useState('');

  const handleNameChange = (e: any) => {
    console.log('event: ', e);
    let val = e.target.value;
    if (typeof(val) !== 'string' || val === undefined || val === null) {
      console.error('Name submission must be a string.');
      val = '';
    }
    setAltName(val);
  };

  const clearName = () => {
    setAltName('');
  };

  const handleUpload = () => {
    let responsePromise;
    if (typeof(analysisId) === 'number' && file.file !== null) {
      responsePromise = AnalysisService.uploadAlgorithm(
          analysisId,
          user.token,
          file.file,
          altName);
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
          clearName();
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
          clearName();
          setUploadSuccess({
            success: false,
          });
        });
  };

  // lmao, you can't use "tar.gz", only "gz", anything after the last "." works
  const fileTypes = ['ZIP', 'GZ'];

  const uploadFile = (fileObject: File) => {
    setFile({
      file: fileObject,
    });
  };

  const handleActive = () => file !== null;

  const handleClear = () => setFile({
    file: null,
  });
  return (
    <div className='
    grid
    grid-row
    justify-center
    text-center
    content-center
    '>
      <div className='
      min-w-md
      max-w-md
      '>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <Typography sx={{marginLeft: 10}} variant="h5">
            PVHub Algorithm Upload
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{marginTop: 2, marginBottom: 2}}
        >
          <FileUploader
            multiple={false}
            handleChange={uploadFile}
            name="file"
            types={fileTypes}
            classes='min-h-36 tableBorderDot'
          />
        </Box>
        <Typography
          sx={{marginLeft: 20}}
          color="gray"
          variant="body1">
          {file.file ? `Staged File: ${file.name}` :
        'No files staged for upload yet.'}
        </Typography>
        <label>
        Custom display name: <input
            name='altName'
            maxLength={50}
            onChange={(e) => handleNameChange(e)}
            className='
            tableBorder
            smShadowed
            '/>
        </label>
        {uploadSuccess.success === true && (
          <Typography
            color="green"
            variant="body1"
            className='
          whitespace-break-spaces
          '>
        Upload Successful! Please check your developer
        page for the status of your upload,
        or upload another file.
          </Typography>
        )}
        {uploadSuccess.success === false && (
          <Typography
            color="red"
            variant="body1"
            className='
          whitespace-break-spaces
          '>
        Upload failed. Please reload the page and try again.
        If you continue to receive issues with the upload,
        please file an issue at our github page,
            {' '}
            <Elink url='https://github.com/slacgismo/pv-validation-hub' />
        .
          </Typography>
        )}
        <div className='flex flex-column' >
          <Button
            disabled={!handleActive()}
            variant="contained"
            onClick={handleUpload}
            className='
          m-1
          '>
        Upload
          </Button>
          <Button
            disabled={!handleActive()}
            variant="contained"
            onClick={handleClear}
            className='
          m-1
          '>
        Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
