// *********** START OF IMPORTS ***********

import { render, fireEvent, waitFor, screen, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import { describe, it, expect } from '@jest/globals';
import { useRouter } from 'next/navigation';
import fetch from 'jest-fetch-mock';
import 'jest-location-mock';

// *********** MODULE IMPORTS ***********

import Login from '@/app/(login)/login/page';
import Register from '@/app/(login)/register/page';
import ForgotUsername from '@/app/(login)/login/forgot_username/page';
import ForgotPassword from '@/app/(login)/login/forgot_password/page';
import Validation from '@/services/validation_service';
import client from '@/services/api_service';

// *********** REDUX IMPORTS ***********

import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/reducers/user';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';

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

// eslint-disable-next-line
jest.mock('../src/services/validation_service');
// eslint-disable-next-line
jest.mock('../src/services/api_service');

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
        username: '',
      },
    },
  });

  it('renders without crashing', () => {
    render(<Provider store={store}>
      <Login />
    </Provider>);
  });
  it('displays error when username is empty', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    fireEvent.click(getByTestId('loginButton'));

    await waitFor(() => {
      expect(screen.getByText('Username can\'t be empty')).toBeInTheDocument();
    });
  });

  it('displays error when password is empty', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    fireEvent.click(getByTestId('loginButton'));

    await waitFor(() => {
      expect(screen.getByText('We need a password')).toBeInTheDocument();
    });
  });

  it('displays error when username is not found', async () => {
    (Validation.isUserNameTaken as jest.Mock).mockReturnValue(false);

    const { getByTestId, getByRole } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    fireEvent.change(getByRole('textbox', { name: /username/i }),
      { target: { value: 'testuser' } });
    fireEvent.click(getByTestId('loginButton'));

    await waitFor(() => {
      expect(getByTestId('uname').parentElement).toHaveTextContent(
        'Username not found'
      );
    });
  });

  it('displays error when email is not found', async () => {
    (Validation.isEmailInUse as jest.Mock).mockReturnValue(false);

    const { getByTestId, getByRole } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    fireEvent.change(getByRole('textbox', { name: /username/i }),
      { target: { value: 'test@example.com' } });
    fireEvent.click(getByTestId('loginButton'));

    await waitFor(() => {
      expect(getByTestId('uname').parentElement).toHaveTextContent(
        'Email not found'
      );
    });
  });
  /*
  it('displays error when login fails', async () => {
    (client.post as jest.Mock).mockRejectedValue(new Error());

    const {getByTestId, getByRole, getByLabelText, findByTestId} = render(
        <Provider store={store}>
          <Login />
        </Provider>
    );

    fireEvent.change(getByRole('textbox', {name: /username/i}),
        {target: {value: 'testuser'}});
    fireEvent.change(getByLabelText(/password/i),
        {target: {value: 'password'}});
    fireEvent.click(getByTestId('loginButton'));

    const alert = await findByTestId('loginAlert', {}, {timeout: 5000});

    expect(alert).toBeInTheDocument();
  });
  */
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
        username: '',
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
