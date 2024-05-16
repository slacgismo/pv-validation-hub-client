'use client';
// *********** START OF IMPORTS ***********

import React, {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Cookies from 'universal-cookie';

// *********** MODULE IMPORTS ***********

import {
  Box, Button, TextField, Grid,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Validation from '@/services/validation_service';
import UserService from '@/services/user_service';
import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';

// *********** REDUX IMPORTS ***********

import {AppDispatch} from '@/store/store';
import {useDispatch} from 'react-redux';
import {logIn} from '@/reducers/user';

// *********** END OF IMPORTS ***********

interface RegisterStates {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterErrors {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const cookies = new Cookies();

  const dispatch = useDispatch<AppDispatch>();


  const router = useRouter();

  const [registerStates, setRegisterStates] = useState<RegisterStates>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [registrationErrors, setRegistrationErrors] = useState<RegisterErrors>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const {id, value} = e.target;
    setRegisterStates((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    setRegistrationErrors((prevState) => ({
      ...prevState,
      [id]: '',
    }));
  };

  /**
   * Function to validate email
   * @param {string} email - email to be validated
   * @return {string} - error message if email is invalid
   */
  function isValidEmail(email: string): string {
    const isValid = /\S+@\S+\.\S+/.test(email);
    if (!isValid) {
      return 'Invalid Email';
    }
    return '';
  }

  /**
   * Function to validate username
   * @param {string} username - username to be validated
   * @return {string} - error message if username is invalid
   */
  function validateUsername(username: string): string {
    const isValid = Validation.isUserNameTaken(username);
    if (!isValid) {
      return 'Username already taken!';
    }
    return '';
  }

  /**
   * Function to validate password
   * @param {string} password - password to be validated
   * @return {string} - error message if password is invalid
   */
  function passwordValidation(password: string): string {
    let errorStatement = '';
    if (!password || password.length === 0) {
      errorStatement = 'Password is a required field';
    } else if (password.length < 8) {
      errorStatement = 'Password must be at least 8 characters';
    }
    return errorStatement;
  }

  /**
   * Function to validate confirm password
   * @param {string} password - password to be validated
   * @param {string} confirmPassword - confirm password to be validated
   * @return {string} - error message if confirm password is invalid
   */
  function confirmPasswordValidation(
      password: string,
      confirmPassword: string): string {
    const isValid = password === confirmPassword;
    if (!isValid) {
      return 'Passwords must match!';
    }
    return '';
  }

  // On submit function, validates all fields
  const submitHandler = (e: React.MouseEvent) => {
    const firstNameError = registerStates.first_name !== '' ? '' :
    'First Name Required';
    const lastNameError = registerStates.last_name !== '' ? '' :
    'Last Name Required';
    const emailError = isValidEmail(registerStates.email);
    const userNameError = validateUsername(registerStates.username);
    const passwordError = passwordValidation(registerStates.password);
    const confirmPasswordError = confirmPasswordValidation(
        registerStates.confirmPassword,
        registerStates.password,
    );

    if (firstNameError !== '' || lastNameError !== '' ||
            emailError !== '' || userNameError !== '' ||
            passwordError !== '' || confirmPasswordError !== '') {
      console.log('firstNameError: ', firstNameError);
      console.log('lastNameError: ', lastNameError);
      console.log('emailError: ', emailError);
      console.log('userNameError: ', userNameError);
      console.log('passwordError: ', passwordError);
      console.log('confirmPasswordError: ', confirmPasswordError);

      setRegistrationErrors({
        first_name: firstNameError,
        last_name: lastNameError,
        email: emailError,
        username: userNameError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      console.log('here is the registration error: ', registrationErrors);
    } else {
      setRegistrationErrors((prevState) => ({
        ...prevState,
        [registrationErrors.first_name]: '',
        [registrationErrors.last_name]: '',
        [registrationErrors.email]: '',
        [registrationErrors.username]: '',
        [registrationErrors.password]: '',
        [registrationErrors.confirmPassword]: '',
      }));
      const response = UserService.register(
          registerStates.username,
          registerStates.email,
          registerStates.password,
          registerStates.first_name,
          registerStates.last_name,
      );
      if (response !== null) {
        cookies.set(
            'user',
            {
              token: response,
            },
            {path: '/', sameSite: 'strict'},
        );
        dispatch(logIn());
        router.push('/');
      }
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
          sx={{mt: '10px'}}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': {m: 1, width: '36ch'},
              '& .MuiButtonBase-root': {m: 1},
              'border': '1.3px solid black',
              'padding': '4em',
            }}
            noValidate
            autoComplete="off"
          >
            {' '}
            <div>
              <Typography variant="h4" gutterBottom>Register</Typography>
              <Typography variant="body1">
                <Link href="/login">Already have an account?</Link>
              </Typography>
            </div>
            <div>

              <TextField
                sx={{'& .MuiTextField-root': {m: 1, width: '18ch'}}}
                required
                id="first_name"
                label="First Name"
                value={registerStates.first_name}
                onChange={handleChange}
                error={registrationErrors.first_name !== ''}
                helperText={registrationErrors.first_name}
              />
            </div>
            <div>
              <TextField
                sx={{'& .MuiTextField-root': {m: 1, width: '36ch'}}}
                required
                id="last_name"
                label="Last Name"
                value={registerStates.last_name}
                onChange={handleChange}
                error={registrationErrors.last_name !== ''}
                helperText={registrationErrors.last_name}
              />
            </div>
            <div>
              <TextField
                required
                id="username"
                label="Username"
                value={registerStates.username}
                onChange={handleChange}
                error={registrationErrors.username !== ''}
                helperText={registrationErrors.username}
              />
            </div>
            <div>
              <TextField
                id="email"
                label="Email"
                value={registerStates.email}
                onChange={handleChange}
                error={registrationErrors.email !== ''}
                helperText={registrationErrors.email}
              />
            </div>
            <div>
              <TextField
                required
                type="password"
                id="password"
                label="Password"
                value={registerStates.password}
                onChange={handleChange}
                error={registrationErrors.password !== ''}
                helperText={registrationErrors.password}
              />
            </div>
            <div>
              <TextField
                required
                type="password"
                id="confirmPassword"
                label="Confirm Password"
                value={registerStates.confirmPassword}
                onChange={handleChange}
                error={registrationErrors.confirmPassword !== ''}
                helperText={registrationErrors.confirmPassword}
              />
            </div>
            <div>
              <Button
                variant="contained"
                onClick={submitHandler}>
                Register
              </Button>
            </div>
          </Box>
        </Grid>
      </main>
      <Footer />
    </div>
  );
};


export default SignupPage;
