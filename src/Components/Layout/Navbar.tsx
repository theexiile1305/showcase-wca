import React from 'react';
import {
  AppBar, Toolbar, Button, IconButton, Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBug, faBars, faFile, faSignInAlt, faSignOutAlt, faUserFriends, faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import style from 'src/Styles';
import { ApplicationState } from 'src/Store/ApplicationState';
import {
  SIGN_IN, SIGN_UP, DOCUMENTS, IDENTITIES, DEBUG, HOME,
} from 'src/Routes';
import { signOut } from 'src/Api/authentication';

const Navbar: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: ApplicationState) => state.user.isAuthenticated);

  const renderAuthenticated = (): React.ReactFragment => (
    <>
      <Button color="inherit" component={Link} to={DOCUMENTS} startIcon={<FontAwesomeIcon icon={faFile} />}>Documents</Button>
      <Button color="inherit" component={Link} to={IDENTITIES} startIcon={<FontAwesomeIcon icon={faUserFriends} />}>Identities</Button>
      <Button color="inherit" component={Link} to={DEBUG} startIcon={<FontAwesomeIcon icon={faBug} />}>Debug</Button>
      <Button color="inherit" component={Link} to={HOME} onClick={() => dispatch(signOut())} startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}>Logout</Button>
    </>
  );

  const renderNotAuthenticated = (): React.ReactFragment => (
    <>
      <Button color="inherit" component={Link} to={SIGN_UP} startIcon={<FontAwesomeIcon icon={faUserPlus} />}>SignUp</Button>
      <Button color="inherit" component={Link} to={SIGN_IN} startIcon={<FontAwesomeIcon icon={faSignInAlt} />}>Login</Button>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to={HOME}>
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
        <Typography variant="h6" className={classes.navbarTitle}>Showcase Web Cryptography API</Typography>
        {isAuthenticated ? renderAuthenticated() : renderNotAuthenticated()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
