'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import {Grid} from '@mui/material';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import ResourceCard from '@/app/modules/resources/resourcecard';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

const ResourcesPage: React.FC = () => {
  // Array of resource objects
  const resources = [
    {
      cardName: 'Developer Tools',
      cardId: 1,
      testId: 'resource-1',
      url: 'https://example.com/resource1',
    },
    {
      cardName: 'Github',
      cardId: 2,
      testId: 'resource-2',
      url: 'https://github.com/slacgismo/pv-validation-hub',
    },
    {
      cardName: 'PVInsight',
      cardId: 3,
      testId: 'resource-2',
      url: 'https://gismo.slac.stanford.edu/research/pvinsight-phase-2',
    },
    {
      cardName: 'Contact Us',
      cardId: 4,
      testId: 'resource-2',
      url: 'https://example.com/resource2',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="
      flex
      min-h-screen
      flex-col
      items-center
      justify-between
      p-24">
        <h1>Resources</h1>
        <p> Something inspirational here.</p>
        <Grid container spacing={2}>
          {resources.map((resource) => (
            <ResourceCard
              key={resource.cardId}
              cardName={resource.cardName}
              cardId={resource.cardId}
              testId={resource.testId}
              url={resource.url}
              linkText={resource.linkText}
            />
          ))}
        </Grid>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
