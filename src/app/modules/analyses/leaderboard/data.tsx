'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import {
  Box, 
  Button, 
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Markdown from 'markdown-to-jsx';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * Data component
 * @param {string} dataDescription
 * @param {string} downloadableLink
 * @return {JSX.Element}
 * @constructor
 */
export default function Data({dataDescription, downloadableLink}:
    { dataDescription: string, downloadableLink: string | null}) {
  const handleDownloadClick = (url: string | null) => {
    console.log('TODO: Implement download functionality');
    console.log('Downloading file from:', url);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={8}>
        <Box>
          <Typography variant="h3">
            Dataset Description
          </Typography>
          { /* eslint-disable-next-line */ }
            <Markdown className='reactMarkdown' children={dataDescription} />
        </Box>
      </Grid>
      <Grid item md={4}>
        <Box sx={{marginTop: 7, marginLeft: 10}}>
          <Typography variant="h6">
            Files
          </Typography>
          <Typography variant="body2">
            {3}
          </Typography>
          <Typography variant="h6">
            Type
          </Typography>
          <Typography variant="body2">
            ZIP
          </Typography>
          <Button
            onClick={() => {
              handleDownloadClick(downloadableLink);
            }}
            variant="contained"
            disabled={(downloadableLink === undefined) ||
                (downloadableLink === null)}
            sx={{
              backgroundColor: 'black',
              width: '100%',
              height: '75%',
              fontSize: 'small',
              marginTop: 3,
            }}
          >
            Download Files
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
