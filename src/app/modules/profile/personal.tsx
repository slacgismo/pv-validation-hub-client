'use client';
// *********** START OF IMPORTS ***********
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {Avatar} from '@mui/material';
import {Button} from '@mui/material';

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
    webLinks: { [key: string]: string };
    organization: string;
    title: string;
    profileImage: string;
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

  if (typeof window !== 'undefined') {
    const host = window.location;
    console.log(host);
  }

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
    <div>
      <div className="
      flex
      items-end
      w-full
      ">
        <div className="flex-1"/>
        <Button className="self-end standardLink">
                Edit
        </Button>
      </div>
      <div className="grid grid-cols-3 profileGrid">
        <div className="
      justify-center
      text-center">
          <Avatar
            sx={{height: 170, width: 174}}
            alt={userDetails.firstName}
            src={`/static/assets/profilecovers/${userDetails.profileImage}`}
            className="mt-1 ml-1"
          />
          <h1 className="mt-1 ml-1" >
            {userDetails.firstName} {userDetails.lastName}
          </h1>
          <h1 className="mt-1 ml-1" >
            {userDetails.title}
          </h1>
        </div>
        <div className="
      ml-10
      flex
      flex-col">
          <div>
            <div className="
          grid grid-rows-1
          ">
              <label className="mt-5">
                Username:
                <span className="ml-20">
                  {userDetails.username}
                </span>
              </label>
              <label className="mt-5">
                Organization:
                <span className="ml-20">
                  {userDetails.organization}
                </span>
              </label>
              <label className="mt-5">
                Profile Link:
                <span className="ml-20">
                  {userDetails.organization}
                </span>
              </label>
            </div>

          </div>
        </div>
        <div>
          <div className="mt-5">
            <label>
            Email:
              <span className="ml-20">
                {userDetails.email}
              </span>
            </label>
          </div>
          <div className="mt-5">
            <label className="mr-20">
            Github:
            </label>
            <Elink
              url={userDetails.githubLink}
              linkText={userDetails.githubLink}
            />
          </div>
          {Object.keys(userDetails.webLinks).map((link) => (
            <Elink
              key={userDetails.webLinks.link}
              url={userDetails.webLinks.link}
              linkText={userDetails.webLinks.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
