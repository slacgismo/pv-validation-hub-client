// *********** START OF IMPORTS ***********

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import {describe, it, expect, beforeEach} from '@jest/globals';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

import {configureStore} from '@reduxjs/toolkit';
import userReducer, {logIn, logOut} from '@/reducers/user';

// *********** END OF IMPORTS ***********


describe('user reducer', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });

  it('handles logIn action', () => {
    store.dispatch(logIn());
    const loggedIn = store.getState().user.loggedIn;
    expect(loggedIn).toBe(true);
  });

  it('handles logOut action', () => {
    store.dispatch(logOut());
    const loggedIn = store.getState().user.loggedIn;
    expect(loggedIn).toBe(false);
  });
});
