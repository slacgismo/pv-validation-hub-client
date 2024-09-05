'use client';
// *********** START OF IMPORTS ***********

import Link from 'next/link';
import React from 'react';
import styles from '@/app/modules/modulecss/footer.module.css';
import {Grid} from '@mui/material';
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
      <Grid container spacing={2}>
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
                  color="inherit">
                  SLAC
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="https://gismo.slac.stanford.edu/"
                  color="inherit">
                  GISMo
                </Link>
              </Grid>
              <Grid item xs={4}>
                <Box alignItems="center" justifyContent="center">
                  <Link
                    href="/"
                    className="
                    text-2xl
                    font-bold
                    ">
                    Valhub
                  </Link>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Link href="https://gismo.slac.stanford.edu/news-and-events"
                  color="inherit">
                  News
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="https://www.energy.gov/eere/solar/
                solar-energy-technologies-office"
                color="inherit">
                  SETO
                </Link>
              </Grid>
            </Grid>
            <Grid item xs={2} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <div>
            This work is supported by the U.S. Department of Energy’s
            Office of Energy Efficiency and Renewable Energy (EERE) under
            the Solar Energy Technologies Office Award Number 38529.
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// *********** END OF COMPONENT ***********
