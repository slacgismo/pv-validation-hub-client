'use client';
// *********** START OF IMPORTS ***********

import React from 'react';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

// *********** MODULE IMPORTS ***********

import CookieService from '@/services/cookie_service';

// *********** REDUX IMPORTS ***********

import {AppDispatch} from '@/store/store';
import {useDispatch} from 'react-redux';
import {logOut} from '@/reducers/user';

// *********** END OF IMPORTS ***********

const LogoutPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(logOut());
    CookieService.deleteUserCookie();
    router.push('/');
  }, [dispatch, router]);

  return (
    <>
      <div>Logging out...</div>
    </>);
};

export default LogoutPage;
