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
import Validation from '@/services/validation_service';
import UserService from '@/services/user_service';
import Header from '@/app/modules/header/header';
import Footer from '@/app/modules/footer/footer';
import Terms from '@/app/(login)/register/terms';

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
  acceptTerms: boolean;
}

interface RegisterErrors {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const SignupPage: React.FC = () => {
  const cookies = new Cookies();

  const dispatch = useDispatch<AppDispatch>();


  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const isClosed = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const [registerStates, setRegisterStates] = useState<RegisterStates>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [registrationErrors, setRegistrationErrors] = useState<RegisterErrors>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;
    if (id === 'acceptTerms') {
      setRegisterStates((prevState) => ({
        ...prevState,
        [id]: !registerStates.acceptTerms,
      }));
      setRegistrationErrors((prevState) => ({
        ...prevState,
        [id]: false,
      }));
      return;
    } else {
      setRegisterStates((prevState) => ({
        ...prevState,
        [id]: value,
      }));
      setRegistrationErrors((prevState) => ({
        ...prevState,
        [id]: '',
      }));
      return;
    }
  };

  /**
   * Function to validate email
   * @param {string} email - email to be validated
   * @return {string} - error message if email is invalid
   */
  function isValidEmail(email: string): string {
    const isValid = /\S+@\S+\.\S+/.test(email);
    const isProfessional = Validation.hasNoProfanity(email);
    if (!isValid) {
      return 'Invalid Email';
    }
    if (!isProfessional) {
      const issue = 'Use of profanity violates our terms of service. ' +
      'Please select a different email.';
      return issue;
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
    const isProfessional = Validation.hasNoProfanity(username);
    if (!isValid) {
      return 'Username already taken!';
    }
    if (!isProfessional) {
      const issue = 'Use of profanity violates our terms of service. ' +
      'Please select a different username.';
      return issue;
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

  /**
   * Function to validate professional names
   * @param {string} name - name entry to be validated
   * @return {string} - error message if names are invalid
   */
  function checkNameErrors(
      name: string): string {
    const nameLower = name.toLowerCase();
    const isValid = name.length > 0;
    const isProfessional = Validation.hasNoProfanity(nameLower);

    if (!isValid) {
      return 'First and Last Name Required';
    }

    if (!isProfessional) {
      const issue = 'Use of profanity violates our terms of service. ' +
        'Please use a professional name.';
      return issue;
    }
    return '';
  }

  // On submit function, validates all fields
  const submitHandler = (e: React.MouseEvent) => {
    const firstNameError = checkNameErrors(registerStates.first_name);
    const lastNameError = checkNameErrors(registerStates.last_name);
    const emailError = isValidEmail(registerStates.email);
    const userNameError = validateUsername(registerStates.username);
    const passwordError = passwordValidation(registerStates.password);
    const confirmPasswordError = confirmPasswordValidation(
        registerStates.confirmPassword,
        registerStates.password,
    );
    const acceptTermsError = !registerStates.acceptTerms;

    if (firstNameError !== '' || lastNameError !== '' ||
            emailError !== '' || userNameError !== '' ||
            passwordError !== '' || confirmPasswordError !== '') {
      setRegistrationErrors({
        first_name: firstNameError,
        last_name: lastNameError,
        email: emailError,
        username: userNameError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        acceptTerms: acceptTermsError,
      });
    } else {
      setRegistrationErrors((prevState) => ({
        ...prevState,
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
      }));
      const response = UserService.register(
          registerStates.username,
          registerStates.email,
          registerStates.password,
          registerStates.first_name,
          registerStates.last_name,
          registerStates.acceptTerms,
      );
      if (response !== null) {
        cookies.set(
            'user',
            {
              token: response,
              sameSite: 'lax',
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
            className='shadowedBox'
          >
            {' '}
            <div className='flex flex-column'>
              <span className='headerText'>
                Registration
              </span>
              <span className='rAlign'>
                <Link href="/login" className='uLink'>
                  Sign In
                </Link>
              </span>
            </div>
            <div>

              <TextField
                className='isolate'
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
                className='isolate'
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
                className='isolate'
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
                className='isolate'
                required
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
                className='isolate'
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
                className='isolate'
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
            <div className='flex flex-row'>
              <div>
                <input
                  type="checkbox"
                  id="acceptTerms"
                  onChange={handleChange}
                  checked={registerStates.acceptTerms}
                  className='m-1'
                />
                <label htmlFor="acceptTerms">I agree to follow the</label>
                <Button onClick={openModal} className='uLink'>
                Terms and Conditions
                </Button>
              </div>
              <Button
                variant="contained"
                onClick={submitHandler}
                className='rAlign'
                disabled={!registerStates.acceptTerms}
              >
                Register
              </Button>
            </div>
          </Box>
        </Grid>
        <Terms isOpen={isOpen} closeModal={isClosed} />
      </main>
      <Footer />
    </div>
  );
};


export default SignupPage;
