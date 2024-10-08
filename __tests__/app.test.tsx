// *********** START OF IMPORTS ***********

import {render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import {describe, it, expect} from '@jest/globals';
import fetch from 'jest-fetch-mock';
import 'jest-location-mock';
// import mockRouter from '../__mocks__/next-router-mock';

// *********** MODULE IMPORTS ***********

import Home from '../src/app/page';

// *********** REDUX IMPORTS ***********

import {configureStore} from '@reduxjs/toolkit';
import userReducer from '@/reducers/user';
import {Provider} from 'react-redux';
import {store} from '../src/store/store';

// *********** END OF IMPORTS ***********

describe('Home page', () => {
  global.fetch = fetch as any;
  it('renders without crashing', () => {
    render(<Provider store={store}>
      <Home />
    </Provider>);
  });
});

describe('Header', () => {
  global.fetch = fetch as any;
  it('renders header links', async () => {
    render(<Provider store={store}>
      <Home />
    </Provider>);

    // Get a reference to the push function from the useRouter hook
    // eslint-disable-next-line

    // Get an array of all link elements
    const allLinks = screen.queryAllByRole('link');

    // Filter this array to get the specific links
    const signInLink = allLinks.find((link) => (
      link.textContent === 'Sign In')
    );
    const registerLink = allLinks.find((link) => (
      link.textContent === 'Register')
    );
    const homeLink = allLinks.find((link) => (
      typeof(link.textContent) === 'string' &&
      link.textContent.includes('PVHub Home') )
    );
    const analysesLink = allLinks.find((link) => (
      link.textContent === 'Analytical Tasks')
    );
    const mySubmissionsLink = allLinks.find((link) => (
      link.textContent === 'My Submissions')
    );
    const resourcesLink = allLinks.find((link) => (
      link.textContent === 'Resources')
    );

    expect(signInLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(analysesLink).toBeInTheDocument();
    expect(mySubmissionsLink).toBeInTheDocument();
    expect(resourcesLink).toBeInTheDocument();

    // Test that when each link is clicked, the page URL includes their route
    /*
    await userEvent.click(signInLink!);
    console.log('mock:', mockRouter);
    expect(mockRouter.asPath).toBe('/login');

    await userEvent.click(registerLink!);
    expect(mockRouter.asPath).toBe('/register');

    await userEvent.click(homeLink!);
    expect(mockRouter.asPath).toBe('/');

    await userEvent.click(analysesLink!);
    expect(mockRouter.asPath).toBe('/analyses');

    await userEvent.click(mySubmissionsLink!);
    expect(mockRouter.asPath).toBe('/mysubmissions');

    await userEvent.click(resourcesLink!);
    expect(mockRouter.asPath).toBe('/resources');
    */
  }),
  it('renders the user avatar and user menus', () => {
    // Create a mock store with the desired initial state
    const mockStore = configureStore({
      reducer: {
        user: userReducer,
      },
      preloadedState: {
        user: {
          loggedIn: true,
        },
      },
    });

    render(<Provider store={mockStore}>
      <Home />
    </Provider>);

    // Test that when loggedIn is set to true, the Avatar element is rendered
    // You need to update your Header component to accept a loggedIn prop and pass it to the UserInfoMenu component
    // Then, in your UserInfoMenu component, you can conditionally render the Avatar element based on the loggedIn prop
    // For example: {loggedIn && <Avatar />}
    // After you've done this, you can update the test like this:
    const avatar = screen.getByAltText('User');
    expect(avatar).toBeInTheDocument();
    fireEvent.click(avatar);

    // Check if the menu is in the document
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    const logoutButton = screen.getByText('Logout');
    const settingsButton = screen.getByText('Settings');

    expect(logoutButton).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
  });
});

describe('Footer', () => {
  global.fetch = fetch as any;
  it('renders footer elements', () => {
    render(<Provider store={store}>
      <Home />
    </Provider>);

    // Get an array of all link elements
    const allLinks = screen.queryAllByRole('link');

    // Filter this array to get the specific links
    const blogLink = allLinks.find((link) => (
      link.textContent === 'News')
    );
    expect(blogLink).toBeInTheDocument();
  });
});
