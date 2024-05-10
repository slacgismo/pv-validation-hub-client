'use client';
// *********** START OF IMPORTS ***********
import Link from 'next/link';
import styles from '../modulecss/header.module.css';
import React, {useState, useRef} from 'react';

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

// *********** REDUX IMPORTS ***********

import {useSelector} from 'react-redux';
import {selectLoggedIn} from '@/reducers/user';


// *********** END OF IMPORTS ***********

// *********** START OF INTERFACES ***********

interface NavMenuPage {
    route: string;
    text: string;
  }

  interface NavMenuProps {
    pages: NavMenuPage[];
  }

  interface UserInfoMenuItem {
    text: string;
    route: string;
    border: boolean;
  }

  interface UserInfoMenuProps {
    userInfoMenu: UserInfoMenuItem[];
  }

// *********** END OF INTERFACES ***********

/**
 * The Header component is the header of the app.
 * It displays the logo, navigation menu, and user information.
 * @return {JSX.Element} The rendered Header component.
 */
export default function Header() {
  const loggedIn = useSelector(selectLoggedIn);

  // *********** START OF DEFINITIONS ***********

  const userInfoMenu: UserInfoMenuItem[] = [
    {
      text: 'Settings',
      route: '/settings',
      border: true,
    },
    {
      text: 'Logout',
      route: '/developer',
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
      <AppBar position="fixed" sx={{backgroundColor: 'white'}}>
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
          PVHub Home
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
        <Link className={styles.menuLink}
          key={`${index}-${page.route}`}
          href={page.route}>
          <a style={{margin: '1rem',
            color: '#18A0FB', display: 'block',
            textTransform: 'none'}}>
            {page.text}
          </a>
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
    <Box sx={{'flexGrow': 0}}>
      <Link className={styles.homeLink} href={'/login'}>
            Sign In
      </Link>
      <Link className={styles.homeLink} href={'/register'}>
            Register
      </Link>
    </Box>
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
            src={`${process.env.PUBLIC_URL}/assets/profilecovers/ducky.png`} />
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
