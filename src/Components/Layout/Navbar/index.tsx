/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Tooltip, LinearProgress,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import BugReportIcon from '@material-ui/icons/BugReport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MenuIcon from '@material-ui/icons/Menu';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import style from 'src/Styles';
import {
  SIGN_IN, SIGN_UP, DOCUMENTS, IDENTITIES, DEBUG, HOME, USER,
} from 'src/Routes';
import { signOut, isAuthenticated } from 'src/Api/firebase/authentication';
import { ApplicationState } from 'src/Store/ApplicationState';

const Navbar: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();
  const history = useHistory();

  const loading = useSelector((state: ApplicationState) => state.ui.loading);

  const renderButton = (
    name: string, icon: JSX.Element, link: string, clickAction?: () => void,
  ): React.ReactFragment => (
    <Tooltip title={name}>
      <IconButton
        color="inherit"
        component={Link}
        to={link}
        onClick={clickAction}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={HOME}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.navbarTitle}>
          Showcase Web Cryptography API
          </Typography>
          {isAuthenticated() ? (
            <>
              {renderButton('Documents', <InsertDriveFileIcon />, DOCUMENTS)}
              {renderButton('Identities', <PeopleIcon />, IDENTITIES)}
              {renderButton('User Management', <SettingsIcon />, USER)}
              {renderButton('Debug', <BugReportIcon />, DEBUG)}
              {renderButton('Logout', <ExitToAppIcon />, HOME, () => dispatch(
                signOut(() => history.push(HOME)),
              ))}
            </>
          ) : (
            <>
              {renderButton('Sign Up', <PersonAddIcon />, SIGN_UP)}
              {renderButton('Sign In', <ArrowForwardIcon />, SIGN_IN)}
            </>
          )}
        </Toolbar>
      </AppBar>
      {loading && (<LinearProgress color="secondary" />)}
    </>
  );
};

export default Navbar;
