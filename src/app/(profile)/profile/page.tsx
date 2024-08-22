'use client';
// *********** START OF IMPORTS ***********

import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@mui/material';
import {useRouter} from 'next/navigation';
import {useSearchParams} from 'next/navigation';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import CookieService from '@/services/cookie_service';
import UserService from '@/services/user_service';
import PersonalDetails from '@/app/modules/profile/personal';
import ProfileActions from '@/app/modules/profile/actions';
import ProfileTasks from '@/app/modules/profile/tasks';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

type UserDetails = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  githubLink: string;
  addtlLinks: string[];
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userProfile: string = searchParams.get('uname') || '';

  const [user, setUser] = useState(userProfile);
  const [userToken, setUserToken] = useState({token: ''});
  const [isLoading, setIsLoading] = useState(true);

  const url = '/account/public/';

  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    githubLink: '',
    addtlLinks: [],
  });

  useEffect(() => {
    const retUser = CookieService.getUserCookie();
    if (retUser === null || retUser === undefined) {
      router.push('/login');
    } else {
      setUserToken(retUser);
    }
    if (userProfile === null || userProfile === undefined) {
      setUser(retUser.username);
    }
  }, [router, userProfile]);

  useEffect( () => {
    UserService.getUserDetails(url, user)
        .then((response) => {
          console.log('userInfo: ', response);
          setUserDetails(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error: ', error);
          setIsLoading(false);
        });
  }, [userProfile, user, url]);

  const renderContent = () => {
    switch (true) {
      case (userToken === undefined) || (userToken === null):
        router.push('/login');
        break;
      case isLoading:
        return <CircularProgress />;
      default:
        return (
          <div className="grid grid-rows-6 tableBorder">
            <div className="border-b-2">
              <h1 className="text-4xl">Personal Details</h1>
            </div>
            <div>
              <PersonalDetails
                userDetails={userDetails}
                userToken={userToken.token}
              />
            </div>
            <div className="border-b-2 border-t-2">
              <h1 className="text-4xl">Submitted Tasks</h1>
            </div>
            <div>
              <ProfileActions />
            </div>
            <div className="border-b-2 border-t-2">
              <h1 className="text-4xl">More Actions</h1>
            </div>
            <div>
              <ProfileTasks />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <div>
          { renderContent() }
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
