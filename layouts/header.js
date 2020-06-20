import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Router from 'next/router';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from 'next/link';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import Avatar from '@material-ui/core/Avatar';
import { withFirebase } from '../hoc/withFirebase';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logo: {
    marginRight: '10px',
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
  iconButton: {
    borderRadius: '15px',
  },
  displayName: {
    fontSize: '16px',
    marginRight: '5px',
  },
}));

const Header = ({ user, firebase, onLogout }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (firebase) {
      await firebase.doSignOut();
    }
    if (isFunction(onLogout)) {
      await onLogout();
    }
    window.location = '/login';
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <>
            <img width="40px" src="/logopng.png" className={classes.logo} alt="todo list logo" />
            <Link href="/">
              <Typography variant="h6" className={classes.title}>
                Next.js Todo List
              </Typography>
            </Link>
          </>
          {!user ? (
            <Button onClick={() => Router.push('/login')} color="inherit">
              Login
            </Button>
          ) : (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                className={classes.iconButton}
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user.photoURL ? (
                  <>
                    <p className={classes.displayName}>{user.displayName}</p>
                    <Avatar alt="user avatar" src={user.photoURL} />
                  </>
                ) : (
                  <Avatar>U</Avatar>
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  firebase: PropTypes.object,
  onLogout: PropTypes.func,
  user: PropTypes.object,
};

export default withFirebase(Header);
