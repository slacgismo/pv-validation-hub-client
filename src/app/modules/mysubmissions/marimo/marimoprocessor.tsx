'use client';
// *********** START OF IMPORTS ***********

import React from 'react';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********


const MarimoProcessor = ({htmlFile}: {htmlFile: string}) => {
  console.log('htmlFile: ', htmlFile);
  return (
    <div className="iframeContainer">
      <iframe
        src={htmlFile}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default MarimoProcessor;
