// *********** START OF IMPORTS ***********

import {render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import {describe, it, expect} from '@jest/globals';
import {useRouter} from 'next/navigation';
import fetch from 'jest-fetch-mock';

// *********** MODULE IMPORTS ***********

import Login from '@/app/(login)/login/page';
import Register from '@/app/(login)/register/page';
import ForgotUsername from '@/app/(login)/login/forgot_username/page';
import ForgotPassword from '@/app/(login)/login/forgot_password/page';

// *********** REDUX IMPORTS ***********

import {configureStore} from '@reduxjs/toolkit';
import userReducer from '@/reducers/user';
import {Provider} from 'react-redux';
import {store} from '../src/store/store';

// *********** END OF IMPORTS ***********

// Mock the next/navigation module, disable lint because
// for some ungodly reason, the linter doesn't like this
// eslint-disable-next-line
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      // eslint-disable-next-line
      push: jest.fn(),
    };
  },
}));

describe('Login page', () => {
  global.fetch = fetch as any;

  // Create a mock store with the desired initial state
  const mockStore = configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        loggedIn: false,
      },
    },
  });

  it('renders without crashing', () => {
    render(<Provider store={store}>
      <Login />
    </Provider>);
  });
});

describe('Register page', () => {
  global.fetch = fetch as any;

  // Create a mock store with the desired initial state
  const mockStore = configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        loggedIn: false,
      },
    },
  });

  it('renders without crashing', () => {
    render(<Provider store={store}>
      <Register />
    </Provider>);
  });
});

describe('Forgot Username page', () => {
  global.fetch = fetch as any;
  it('renders without crashing', () => {
    render(<Provider store={store}>
      <ForgotUsername />
    </Provider>);
  });
});

describe('Forgot Password page', () => {
  global.fetch = fetch as any;
  it('renders without crashing', () => {
    render(<Provider store={store}>
      <ForgotPassword />
    </Provider>);
  });
});
