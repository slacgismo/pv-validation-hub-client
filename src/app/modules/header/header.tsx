'use client';
// *********** START OF IMPORTS ***********
import Link from 'next/link';
import styles from '../modulecss/header.module.css';
import React, {useState, useRef, useEffect} from 'react';

// *********** MODULE IMPORTS ***********

// MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CookieService from '@/services/cookie_service';

// *********** REDUX IMPORTS ***********

import {useAppSelector} from '@/store/store';
import {useDispatch} from 'react-redux';
import {logIn} from '@/reducers/user';

// *********** END OF IMPORTS ***********

// *********** START OF INTERFACES ***********

  type NavMenuPage = {
    route: string;
    text: string;
  }

  type NavMenuProps = {
    pages: NavMenuPage[];
  }

  type UserInfoMenuItem = {
    text: string;
    route: string;
    border: boolean;
  }

  type UserInfoMenuProps = {
    userInfoMenu: UserInfoMenuItem[];
  }

// *********** END OF TYPES ***********

/**
 * The Header component is the header of the app.
 * It displays the logo, navigation menu, and user information.
 * @return {JSX.Element} The rendered Header component.
 */
export default function Header() {
  const dispatch = useDispatch();
  const loggedIn = useAppSelector((state) => (
    state.user.loggedIn)
  );
  const curUser = useAppSelector((state) => (
    state.user.username)
  );

  useEffect(() => {
    if (!loggedIn) {
      const userCookie = CookieService.getUserCookie();
      if (userCookie && userCookie.token) {
        dispatch(logIn(userCookie.username));
      }
    }
  }, [dispatch, loggedIn]);

  // *********** START OF DEFINITIONS ***********

  const userInfoMenu: UserInfoMenuItem[] = [
    {
      text: 'Settings',
      route: `/profile?uname=${curUser}`,
      border: true,
    },
    {
      text: 'Logout',
      route: '/logout',
      border: false,
    },
  ];


  // This is an array of NavMenuPage objects, it is fun learning the typescript syntax!
  const navPages: NavMenuPage[] = [
    {
      text: 'Analytical Tasks',
      route: '/analyses',
    },
    {
      text: 'My Submissions',
      route: '/mysubmissions',
    },
    {
      text: 'Resources',
      route: '/resources',
    },
  ];
    // *********** END OF DEFINITIONS ***********

  return (
    <Box sx={{display: 'flex '}}>
      <AppBar position="fixed" sx={{backgroundColor: '#31A69B'}}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Logo redirect="/" />
            <NavMenu pages={navPages} />
            {
                !loggedIn ?
                  <UserLoggedInMenu /> :
                  (
                    <UserInfoMenu
                      userInfoMenu={userInfoMenu}
                    />
                  )
            }
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

/**
 * The Logo component is the logo of the app.
 * It displays the logo and redirects to the homepage.
 * @param {string} redirect The URL to redirect to.
 * @return {JSX.Element} The rendered Logo component.
 */
function Logo({redirect}: {redirect: string}) {
  return (

    <Link className={styles.homeLink} href={redirect}>
          PVHub Home (Beta)
    </Link>

  );
}

/**
 * The NavMenu component is the navigation menu of the app.
 * It displays the navigation menu items.
 * @param {NavMenuProps} pages The pages to display in the navigation menu.
 * @return {JSX.Element} The rendered NavMenu component.
 */
const NavMenu: React.FC<NavMenuProps> = ({pages}) => {
  return (
    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
      {pages.map((page, index) => (
        <Link className={`${styles.menuLink} ${styles.headerBackground}`}
          key={`${index}-${page.route}`}
          href={page.route}>
          {page.text}
        </Link>
      ))}
    </Box>
  );
};

/**
 * The UserLoggedInMenu component is the menu for logged out users.
 * It displays the sign in and register buttons.
 * @param {function} onClick The function to call when a menu item is clicked.
 * @return {JSX.Element} The rendered UserLoggedInMenu component.
 */
function UserLoggedInMenu() {
  return (
    <div className='flex flex-row flex-nowrap'>
      <Link className={`${styles.homeLink} p-3`} href={'/register'}>
            Register
      </Link>
      <Link className={`${styles.homeLink} p-3`} href={'/login'}>
            Sign In
      </Link>
    </div>
  );
}

/**
 * The UserInfoMenu component is the menu for logged in users.
 * It displays the user information menu items.
 * @param {object[]} userInfoMenu The user information menu items.
 * @return {JSX.Element} The rendered UserInfoMenu component.
 */
function UserInfoMenu({userInfoMenu}: UserInfoMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <Box sx={{flexGrow: 0}}>
      <Tooltip title="Open settings">
        <IconButton ref={anchorRef} onClick={handleOpenMenu} sx={{p: 0}}>
          <Avatar alt="User"
            src={`/static/assets/profilecovers/ducky.jpg`} />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{mt: '45px'}}
        id="menu-appbar"
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={menuOpen}
        onClose={handleCloseMenu}
      >
        {
          userInfoMenu.map((item: UserInfoMenuItem) => {
            const boxKey = item.text;
            const menuKey = `${item.text} menu`;
            const route = `${item.route}`;
            return (
              <Box key={boxKey}>
                <MenuItem key={menuKey}>
                  <Link className={styles.homeLink} href={route}>
                    {item.text}
                  </Link>
                </MenuItem>
                { item.border ? <Divider /> : <Box /> }
              </Box>
            );
          })
        }
      </Menu>
    </Box>
  );
}
