'use client';
// *********** START OF IMPORTS ***********

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import styles from '@/app/modules/modulecss/footer.module.css';
import {Grid, Typography} from '@mui/material';
import {Box} from '@mui/system';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

/**
 * The Footer component is the footer of the app.
 * @return {JSX.Element} The rendered Footer component.
 */
export default function Footer() {
  return (
    <Box sx={{
      height: 150,
      minHeight: 100,
      maxHeight: 200,
    }}
    className={styles.footerBackground}
    >
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center"
            alignItems="center" sx={{borderBottom: 1, borderColor: 'divider',
              marginTop: 4}}>
            <Grid item xs={2} />
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Link
                  href="https://www6.slac.stanford.edu/
                  news-and-events/connect-with-us"
                  underline="hover" color="inherit">
                  Community
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="https://www6.slac.stanford.edu/about"
                  underline="hover" color="inherit">
                  Company
                </Link>
              </Grid>
              <Grid item xs={4}>
                <Box alignItems="center" justifyContent="center">
                  <Typography
                    display="block"
                    align="center"
                    variant="h6"
                    noWrap
                    href="/"
                    sx={{
                      mr: 2,
                      fontFamily: 'sans-serif',
                      fontWeight: 700,
                      color: 'black',
                      textDecoration: 'none',
                    }}
                  >
                    PVHub
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Link href="https://www6.slac.stanford.edu/
                news-and-events/news-center"
                underline="hover" color="inherit">
                  Blog
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="https://www6.slac.stanford.edu/about/resources"
                  underline="hover" color="inherit">
                  Resources
                </Link>
              </Grid>
            </Grid>
            <Grid item xs={2} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Image src="/static/next.svg"
              alt="Next.js Logo" width={32} height={32} />
            <Image src="/static/next.svg"
              alt="Next.js Logo" width={32} height={32} />
            <Image src="/static/next.svg"
              alt="Next.js Logo" width={32} height={32} />
            <Image src="/static/next.svg"
              alt="Next.js Logo" width={32} height={32} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// *********** END OF COMPONENT ***********
