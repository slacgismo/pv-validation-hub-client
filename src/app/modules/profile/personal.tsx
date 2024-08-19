'use client';
// *********** START OF IMPORTS ***********
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid, Typography,
  TextField,
  Button,
  CardActions,
} from '@mui/material';
import {Box} from '@mui/system';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogAction from '@mui/material/DialogActions';

// *********** MODULE IMPORTS ***********

import CookieService from '@/services/cookie_service';
import UserService from '@/services/user_service';
import Elink from '@/app/modules/elink/elink';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

// *********** START OF TYPES ***********

type UserDetails = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    githubLink: string;
    addtlLinks: string[];
  }

// *********** END OF TYPES ***********

/**
 *
 * @return {JSX.Element}
 */
export default function PersonalDetails() {
  return 'hi';
}
