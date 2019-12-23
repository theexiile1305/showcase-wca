import React from 'react';
import {
  AppBar, Toolbar, Button, IconButton, Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBug, faBars, faFile, faSignInAlt, faSignOutAlt, faUserFriends, faUser, faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import style from 'src/Styles';
import { ApplicationState } from 'src/Store/ApplicationState';
import {
  SIGN_IN, SIGN_UP, DOCUMENTS, IDENTITIES, DEBUG, HOME, USER,
} from 'src/Routes';
import { signOut } from 'src/Api/authentication';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const Navbar: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: ApplicationState) => state.user.isAuthenticated);

  const renderButton = (
    name: string, icon: IconProp, link: string, clickAction?: () => void,
  ): React.ReactFragment => (
    <Button
      color="inherit"
      component={Link}
      to={link}
      onClick={clickAction}
      startIcon={
        <FontAwesomeIcon icon={icon} />
      }
    >
      {name}
    </Button>
  );

  const renderAuthenticated = (): React.ReactFragment => (
    <>
      {renderButton('Documents', faFile, DOCUMENTS)}
      {renderButton('Identities', faUserFriends, IDENTITIES)}
      {renderButton('User', faUser, USER)}
      {renderButton('Debug', faBug, DEBUG)}
      {renderButton('Logout', faSignOutAlt, HOME, () => dispatch(signOut()))}
    </>
  );

  const renderNotAuthenticated = (): React.ReactFragment => (
    <>
      {renderButton('Sign Up', faUserPlus, SIGN_UP)}
      {renderButton('Sign In', faSignInAlt, SIGN_IN)}
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to={HOME}>
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
        <Typography variant="h6" className={classes.navbarTitle}>
          Showcase Web Cryptography API
        </Typography>
        {isAuthenticated ? renderAuthenticated() : renderNotAuthenticated()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
