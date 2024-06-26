'use client';
// *********** START OF IMPORTS ***********

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
import {useRouter} from 'next/navigation';
import {useSearchParams} from 'next/navigation';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import CookieService from '@/services/cookie_service';
import UserService from '@/services/user_service';
import Elink from '@/app/modules/elink/elink';

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

const UpdateDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

// Dialog that shows whether user profile successfully updated or not.
/**
 * ProfileUpdateDialog component
 * @param {boolean} open - whether the dialog is open
 * @param {function} onClose - function to handle the close
 * @return {JSX.Element} - ProfileUpdateDialog component
 */
function ProfileUpdateDialog({open, onClose}:
  {open: boolean, onClose: any}) {
  return (
    <UpdateDialog open={open}>
      <DialogContent dividers>
        <Typography gutterBottom>
          Update Succeed!
        </Typography>
      </DialogContent>
      <DialogAction>
        <Button autoFocus onClick={onClose}>
          <Typography variant="body2">
            Done
          </Typography>
        </Button>
      </DialogAction>
    </UpdateDialog>
  );
}

const ProfileCardContent = styled(CardContent)(({theme}) => ({
  '& .MuiTypography-root': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  '& .MuiTypography-body1': {
    align: 'center',
    justifyContent: 'flex-end',
  },
  'marginBottom': 0.5,
  'marginTop': 0.5,
}));

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userProfile: string = searchParams.get('uname') || '';

  const [user, setUser] = useState(userProfile);
  const [userToken, setUserToken] = useState({token: ''});

  // prepare for user profile fields update
  const [githubLink, setUserGithubLink] = useState('');
  const [emailLink, setUserEmailLink] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const url = '/account/public/';

  const urlUpdate = (
    userToken !== null
  ) && (
    userToken !== undefined
  ) ? '/account/update/' : '';

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

  const handleTextChange = (setState: any) => (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(event.target.value);
  };

  const handleProfileUpdateClick = (userToken: any) => {
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
  };

  const renderContent = () => {
    switch (true) {
      case (userToken === undefined) || (userToken === null):
        router.push('/login');
        break;
      case isLoading:
        return <CircularProgress />;
      default:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardMedia
                  sx={{marginTop: 1, marginBottom: 2}}>
                  <Avatar
                    sx={{height: 170, width: 174}}
                    alt={userDetails.firstName}
                    src={'/static/assets/profilecovers/ducky.jpg'}
                  />
                </CardMedia>
                <CardContent >
                  <Typography variant="h5">
                    {`${userDetails.firstName} 
                    ${userDetails.lastName}`}
                  </Typography>
                  <br />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={9}>
              <Card variant="outlined">
                <ProfileCardContent>
                  <InfoRow
                    title="Full Name"
                    defaultValue={`${userDetails.firstName} 
                    ${userDetails.lastName}`}
                    disabled
                  />
                  <InfoRow
                    title="Email"
                    defaultValue={userDetails.email}
                    disabled={false}
                    onChange={handleTextChange(setUserEmailLink)}
                  />
                  <InfoRow
                    title="Username"
                    defaultValue={userDetails.username}
                    disabled
                  />
                  <InfoRow
                    title="Github"
                    defaultValue={userDetails.githubLink}
                    disabled={false}
                    onChange={handleTextChange(setUserGithubLink)}
                  />
                  <Elink url={userDetails.githubLink} />
                </ProfileCardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={handleProfileUpdateClick}>
                    <Typography >Update profile</Typography>
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <ProfileUpdateDialog
              open={updateDialogOpen}
              onClose={() => {
                setUpdateDialogOpen(false);
              }}
            />
          </Grid>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <Box sx={{marginTop: 5, marginLeft: 4, marginRight: 4}}>
          { renderContent() }
        </Box>
      </main>
      <Footer />
    </div>
  );
};

/**
 * InfoRow component
 * @param {string} title - title of the row
 * @param {string} defaultValue - default value of the row
 * @param {boolean} disabled - whether the row is disabled
 * @param {function} onChange - function to handle the change
 * @return {JSX.Element} - InfoRow component
 */
function InfoRow({
  title, defaultValue, disabled, onChange,
}: {
  title: string, defaultValue: string, disabled: boolean, onChange?: any,
}) {
  return (
    <Box>
      <Grid container spacing={5}>
        <Grid item xs={2} alignItems="center" justifyContent="center">
          <Typography variant="body1">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            hiddenLabel
            size="small"
            defaultValue={defaultValue}
            disabled={disabled}
            variant="filled"
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;
