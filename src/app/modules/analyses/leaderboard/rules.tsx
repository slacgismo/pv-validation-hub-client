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
 * Component that displays the rules for a given analysis.
 * @param {string} title - The title of the analysis.
 * @param {string} description - The description of the rules.
 * @return {JSX.Element}
 */
export default function Rules({title, description}: {
    title: string,
    description: string }) {
  return (
    <Container>
      <Box sx={{flexGrow: 1, border: '1px black'}}>
        <Typography variant="h5">
          {`Rules for ${title}`}
        </Typography>
        { /* eslint-disable-next-line */}
          <Markdown className='reactMarkdown' children={description} />
      </Box>
    </Container>
  );
}
