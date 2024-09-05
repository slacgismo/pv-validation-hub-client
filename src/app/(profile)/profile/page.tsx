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

type AllDetails = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  githubLink: string;
  webLinks: { [key: string]: string };
  organization: string;
  title: string;
  profileImage: string;
  submitted_tasks: { [key: string]: string };
}

// *********** END OF TYPES ***********

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
    webLinks: {},
    organization: '',
    title: '',
    profileImage: 'ducky.jpg',
  });

  const [submittedTasks, setSubmittedTasks] = useState<[string, string][]>([]);

  const formatUserDetails = (userDetails: AllDetails) => {
    const details: UserDetails = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      githubLink: '',
      webLinks: {},
      organization: '',
      title: '',
      profileImage: 'ducky.jpg',
    };
    details.username = userDetails.username;
    details.email = userDetails.email;
    details.firstName = userDetails.firstName;
    details.lastName = userDetails.lastName;
    details.githubLink = userDetails.githubLink;
    details.webLinks = userDetails.webLinks;
    details.organization = userDetails.organization;
    details.title = userDetails.title;
    details.profileImage = userDetails.profileImage;
    if (details.title === '') {
      details.title = 'User';
    }
    if (details.organization === '') {
      details.organization = 'N/A';
    }
    setUserDetails(details);

    // Convert submitted_tasks to an array of tuples
    const submittedTasksArray = Object.entries(userDetails.submitted_tasks);
    setSubmittedTasks(submittedTasksArray);
  };

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
          formatUserDetails(response.data);
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
          <div className="flex flex-col tableBorder bg-white">
            <div className="
            b-border
            pal-border
            flex-1
            p-3
            ">
              <h1 className="text-xl">Personal Details</h1>
            </div>
            <div className="flex-1 min-h-80">
              <PersonalDetails
                userDetails={userDetails}
                userToken={userToken.token}
              />
            </div>
            <div className="
            bt-border
            pal-border
            flex-1
            p-3
            ">
              <h1 className="text-xl">Submitted Tasks</h1>
            </div>
            <div className="flex-1 min-h-80">
              <ProfileTasks submittedTasks={submittedTasks} />
            </div>
            <div className="
            bt-border
            pal-border
            flex-1
            p-3
            ">
              <h1 className="text-xl">More Actions</h1>
            </div>
            <div className="flex-1 min-h-80">
              <ProfileActions />
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
