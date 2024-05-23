'use client';
// *********** START OF IMPORTS ***********

import React, {useState, useEffect} from 'react';
import ReactModal from 'react-modal';
import Markdown from 'markdown-to-jsx';

// *********** MODULE IMPORTS ***********

import {
  Box, Button,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import MS from '@/services/md_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

interface TermsProps {
  isOpen: boolean;
  closeModal: Function;
}

const Terms: React.FC<TermsProps> = ({isOpen, closeModal}) => {
  const [terms, setTerms] = useState('');

  useEffect(() => {
    MS.fetchMarkdown('/static/terms.md')
        .then((text) => setTerms(text))
        .catch((error) => console.error(error));
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Terms and Conditions"
      ariaHideApp={false}
      className="modal"
    >
      <Box className="modalContent">
        <Typography variant="h4">Terms and Conditions</Typography>
        <Markdown className='reactMarkdown'>
          {terms}
        </Markdown>
        <Button onClick={() => {
          closeModal();
        }}>Close</Button>
      </Box>
    </ReactModal>
  );
};

export default Terms;
