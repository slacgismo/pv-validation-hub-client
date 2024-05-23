'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import {Typography} from '@mui/material';
import {Box, Container} from '@mui/system';
import Markdown from 'markdown-to-jsx';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * Overview component
 * @param {string} title - title of the overview
 * @param {string} description - description of the overview
 * @return {JSX.Element}
 */
export default function Overview({title, description}: {
    title: string,
    description: string}) {
  return (
    <Container>
      <Box sx={{flexGrow: 1, border: '1px black'}}>
        <Typography variant="h5">
          {title}
        </Typography>
        { /* eslint-disable-next-line */}
          <Markdown className='reactMarkdown' children={description} />
      </Box>
    </Container>
  );
}
