'use client';
// *********** START OF IMPORTS ***********

import React, {useEffect, useState} from 'react';
import {Grid} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Markdown from 'markdown-to-jsx';
import Elink from '@/app/modules/elink/elink';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * CustomizedCard component
 * @param {object} props
 * @param {string} props.cardName
 * @param {number} props.cardId
 * @param {function} props.onClick
 * @param {string} props.testId
 * @return {JSX.Element}
 */
export default function ResourceCard({
  cardName, cardId, testId, url,
}: {
  cardName: string,
  cardId: number,
  testId: string,
  url: string }) {
  const [shortDescription, setShortDescription] = useState('');
  const [cardDir, setCardDir] = useState('');

  useEffect(() => {
    if (cardId !== undefined && cardId !== null) {
      setCardDir(
          `/static/assets/resources/${cardId}/cardCover.png`
      );
      fetch(`/static/assets/resources/${cardId}/shortdesc.md`)
          .then((res) => res.text())
          .then((text) => setShortDescription(text))
          .catch((err) => console.log(err));
    }
  }, [cardId]);

  return (
    <Grid item xs={2} sm={4} md={4} key={cardId}>
      <Card
        sx={{maxWidth: 345, height: 380}}
        key={`${cardName}-${cardId}`}
        data-testid={testId}
        className='
        tableBorder
        justify-center
        content-center
        text-center
        '
      >
        { /* eslint-disable-next-line */ }
        <img
          src={cardDir}
          alt={cardName}
          className='
          object-fill
          tableBorder
          resourceCard
          m-5
          '
        />
        <div className='h-4'>
          <Elink url={url} linkText={cardName} />
        </div>
        <CardContent>
          { /* eslint-disable-next-line */ }
              <Markdown className='reactMarkdown' children={shortDescription !== undefined &&
                              shortDescription.length > 100 ?
                `${shortDescription.slice(0, 100)}.....` : shortDescription}
          />
        </CardContent>
      </Card>
    </Grid>
  );
}
