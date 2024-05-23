'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import Box from '@mui/material/Box';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

// removed prop spreading "...other", as we should know and handle props explicitly
/**
 * TabPanel component
 * @param {object} props - component props
 * @param {number} props.value - current tab value
 * @param {number} props.index - tab index
 * @param {React.ReactNode} props.children - children
 * @return {React.ReactElement} TabPanel component
 */
export default function TabPanel(props: {
  children: React.ReactNode,
  value: number,
  index: number
}) {
  const {
    children, value, index,
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          {children}
        </Box>
      )}
    </div>
  );
}
