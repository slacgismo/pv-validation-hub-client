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

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

interface TermsProps {
  isOpen: boolean;
  closeModal: Function;
}

const Terms: React.FC<TermsProps> = ({isOpen, closeModal}) => {
  const [terms, setTerms] = useState('');

  useEffect(() => {
    fetch('/static/terms.md')
        .then((response) => response.text())
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
        <Markdown>
          {terms}
        </Markdown>
        <Button onClick={closeModal}>Close</Button>
      </Box>
    </ReactModal>
  );
};

export default Terms;
