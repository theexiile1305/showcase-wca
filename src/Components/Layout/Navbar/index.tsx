import React from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Tooltip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBug, faBars, faFile, faSignInAlt, faSignOutAlt, faUserFriends, faUser, faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import style from 'src/Styles';
import {
  SIGN_IN, SIGN_UP, DOCUMENTS, IDENTITIES, DEBUG, HOME, USER,
} from 'src/Routes';
import { signOut } from 'src/Api/firebase/authentication';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const Navbar: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const renderButton = (
    name: string, icon: IconProp, link: string, clickAction?: () => void,
  ): React.ReactFragment => (
    <Tooltip title={name}>
      <IconButton
        color="inherit"
        component={Link}
        to={link}
        onClick={clickAction}
      >
        <FontAwesomeIcon icon={icon} />
      </IconButton>
    </Tooltip>
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
        {renderButton('Documents', faFile, DOCUMENTS)}
        {renderButton('Identities', faUserFriends, IDENTITIES)}
        {renderButton('User', faUser, USER)}
        {renderButton('Debug', faBug, DEBUG)}
        {renderButton('Sign Up', faUserPlus, SIGN_UP)}
        {renderButton('Sign In', faSignInAlt, SIGN_IN)}
        {renderButton('Logout', faSignOutAlt, HOME, () => dispatch(signOut()))}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
