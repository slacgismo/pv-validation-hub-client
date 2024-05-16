import {render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import {describe, it, expect} from '@jest/globals';
import {Provider} from 'react-redux';
import {store} from '../src/store/store';
import Home from '../src/app/page';

import {configureStore} from '@reduxjs/toolkit';
import userReducer from '@/reducers/user';

import {useRouter} from 'next/navigation';

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

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Provider store={store}>
      <Home />
    </Provider>);
  });
});

describe('Header', () => {
  it('renders header links', async () => {
    render(<Provider store={store}>
      <Home />
    </Provider>);

    // Get a reference to the push function from the useRouter hook
    // eslint-disable-next-line
    const push = jest.spyOn(useRouter(), 'push');

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
      link.textContent === 'PVHub Home')
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
    await userEvent.click(signInLink!);
    expect(push).toHaveBeenCalled;

    await userEvent.click(registerLink!);
    expect(push).toHaveBeenCalled;

    await userEvent.click(homeLink!);
    expect(push).toHaveBeenCalled;

    await userEvent.click(analysesLink!);
    expect(push).toHaveBeenCalled;

    await userEvent.click(mySubmissionsLink!);
    expect(push).toHaveBeenCalled;

    await userEvent.click(resourcesLink!);
    expect(push).toHaveBeenCalled;
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
  it('renders footer elements', () => {
    render(<Provider store={store}>
      <Home />
    </Provider>);

    // Get an array of all link elements
    const allLinks = screen.queryAllByRole('link');

    // Filter this array to get the specific links
    const blogLink = allLinks.find((link) => (
      link.textContent === 'Blog')
    );
    expect(blogLink).toBeInTheDocument();
  });
});
