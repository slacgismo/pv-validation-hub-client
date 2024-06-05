'use client';
// *********** START OF IMPORTS ***********

import React, {useState} from 'react';
import Link from 'next/link';

// We need to use useRouter from next/navigation instead of next/navigation
// as it uses special hook for navigation within app directory
import {useRouter} from 'next/navigation';
import Cookies from 'universal-cookie';

// *********** MODULE IMPORTS ***********

import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import {
  Grid, Box, Button, TextField,
} from '@mui/material';
import Validation from '@/services/validation_service';
import client from '@/services/api_service';

// *********** REDUX IMPORTS ***********

import {AppDispatch} from '@/store/store';
import {useDispatch} from 'react-redux';
import {logIn} from '@/reducers/user';

// *********** END OF IMPORTS ***********

interface LoginStates {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const cookies = new Cookies();

  const dispatch = useDispatch<AppDispatch>();

  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();
  const [loginStates, setLoginStates] = useState<LoginStates>({
    username: '',
    password: '',
  });

  const [loginErrors, setLoginErrors] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;
    setLoginStates((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    setLoginErrors((prevState) => ({
      ...prevState,
      [id]: '',
    }));
  };

  /**
   * Check if a username is an email.
   * @param {string} username - The username to check.
   * @return {boolean} - True if the username is an email, false otherwise.
   */
  function isEmail(username: string) {
    if (/\S+@\S+\.\S+/.test(username)) {
      return true;
    }
    return false;
  }

  /**
   * Validate the username.
   * @param {string} username - The username to validate.
   * @return {string} - The error message.
   */
  function validateUsername(username: string) {
    let isValid = false;
    let output = '';
    if (username === '') {
      output = 'Username can\'t be empty';
    } else if (isEmail(username)) {
      isValid = Validation.isEmailInUse(username);
      output = 'Email not found';
    } else {
      isValid = Validation.isUserNameTaken(username);
      output = 'Username not found';
    }
    if (isValid) {
      output = '';
    }
    return output;
  }


  const submitHandler = () => {
    const {username} = loginStates;
    const {password} = loginStates;
    const usernameError = validateUsername(username);

    if (usernameError === '' && password !== '') {
      client.post('/login', {
        username,
        password,
      }).then((response) => {
        if (response.data.token === undefined) {
          console.error('Login failed');
          console.error(response);
          return;
        }
        cookies.set(
            'user',
            {
              token: response.data.token,
              sameSite: 'strict',
            },
            {path: '/', sameSite: 'strict'},
        );
        dispatch(logIn());
        router.push('/');
      }).catch((error) => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
    } else {
      setLoginErrors(() => ({
        username: usernameError,
        password: password === '' ? 'We need a password' : '',
      }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex min-h-screen flex-col
    items-center justify-between p-24">
        <Grid container
          justifyContent="center"
          alignItems="center"
          sx={{mt: '10px'}}
        >
          {
            showAlert &&
            <div className="customAlert" data-testid="loginAlert">
              Login Failed
            </div>
          }
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': {m: 1, width: '35ch'},
              '& .MuiButtonBase-root': {m: 1},
              'border': '1px solid black',
              'padding': '4em',
            }}
            noValidate
            autoComplete="off"
            className='shadowedBox'
          >
            <Box className='flex flex-column'>
              <span className='headerText'>
                Welcome Back!
              </span>
              <span className='rAlign'>
                <Link href="/register" data-testid="reglink" className='uLink'>
                  Register
                </Link>
              </span>
            </Box>
            <Box>
              <TextField
                required
                id="username"
                label="Username"
                value={loginStates.username}
                onChange={handleChange}
                error={loginErrors.username !== ''}
                helperText={loginErrors.username}
                data-testid="uname"
              />
            </Box>
            <Box>
              <TextField
                required
                type="password"
                id="password"
                label="Password"
                value={loginStates.password}
                onChange={handleChange}
                error={loginErrors.password !== ''}
                helperText={loginErrors.password}
                data-testid="pwd"
              />
            </Box>
            <div className='flex flex-row'>
              <Link href="/login/forgot_username" className='uLink m-1'>
                Forgot Username?
              </Link>
              <Link href="/login/forgot_password" className='uLink m-1'>
                Forgot Password?
              </Link>
              <Button
                variant="contained"
                onClick={submitHandler}
                className="m-1"
                data-testid="loginButton"
              >
                Login
              </Button>
            </div>
          </Box>
        </Grid>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
