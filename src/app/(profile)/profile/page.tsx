'use client';
// *********** START OF IMPORTS ***********

import React, {useState} from 'react';
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


// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import CookieService from '@/services/cookie_service';
import UserService from '@/services/user_service';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

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
  // todo(jrl): abstract user cookie and token information to a separate service
  const router = useRouter();
  const user = CookieService.getUserCookie();
  const url = user !== null && user !== undefined ? '/account' : '';
  // eslint-disable-next-line no-unused-vars
  const userInfo = UserService.useGetUserDetails(url, user.token);

  // prepare for user profile fields update
  const [githubLink, setUserGithubLink] = useState('');
  const [emailLink, setUserEmailLink] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleTextChange = (setState: any) => (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(event.target.value);
  };

  const handleProfileUpdateClick = () => {
    const updatedProfile = {
      email: emailLink === '' ? userInfo.userDetails.email : emailLink,
      githubLink: githubLink === '' ?
      userInfo.userDetails.githubLink : githubLink,
    };
      // todo: check return value
      // eslint-disable-next-line no-unused-vars
    const ret = UserService.updateUserProfile(user.token, updatedProfile);
    setUpdateDialogOpen(true);
  };

  console.log('response: ', userInfo.userDetails);

  const renderContent = () => {
    switch (true) {
      case (user === undefined) || (user === null):
        router.push('/login');
        break;
      case userInfo.isLoading:
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
                    alt={userInfo.userDetails.first_name}
                    src={'/static/assets/profilecovers/ducky.png'}
                  />
                </CardMedia>
                <CardContent >
                  <Typography variant="h5">
                    {`${userInfo.userDetails.first_name} 
                    ${userInfo.userDetails.last_name}`}
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
                    defaultValue={`${userInfo.userDetails.first_name} 
                    ${userInfo.userDetails.last_name}`}
                    disabled
                  />
                  <InfoRow
                    title="Email"
                    defaultValue={userInfo.userDetails.email}
                    disabled={false}
                    onChange={handleTextChange(setUserEmailLink)}
                  />
                  <InfoRow
                    title="Username"
                    defaultValue={userInfo.userDetails.username}
                    disabled
                  />
                  <InfoRow
                    title="Github"
                    defaultValue={userInfo.userDetails.githubLink}
                    disabled={false}
                    onChange={handleTextChange(setUserGithubLink)}
                  />
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
