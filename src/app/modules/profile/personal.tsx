'use client';
// *********** START OF IMPORTS ***********
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {Avatar} from '@mui/material';

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
export default function PersonalDetails({
  userDetails,
  userToken,
}: {
    userDetails: UserDetails,
    userToken: string
}) {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const urlUpdate = (
    userToken !== null
  ) && (
    userToken !== undefined
  ) ? '/account/update/' : '';

  const handleTextChange = (setState: any) => (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(event.target.value);
  };

  const handleProfileUpdateClick = (userToken: any) => {
    /*
    const updatedProfile = {
      email: emailLink === '' ? userDetails.email : emailLink,
      githubLink: githubLink === '' ?
        userDetails.githubLink : githubLink,
    };
    // todo: check return value
    // eslint-disable-next-line no-unused-vars
    const ret = UserService.updateUserProfile(
        userToken.token, updatedProfile, urlUpdate
    );
    setUpdateDialogOpen(true);
    */
  };
  return (
    <div className="grid grid-cols-3">

    </div>
  );
}

/*
                  <Avatar
                    sx={{height: 170, width: 174}}
                    alt={userDetails.firstName}
                    src={'/static/assets/profilecovers/ducky.jpg'}
                  />
                  */
