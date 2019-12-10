import React from 'react';
import {
  AppBar, Toolbar, Button, IconButton, Typography, makeStyles, createStyles, Theme,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserStore } from 'src/Store/UserStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBug, faFile, faSignInAlt, faSignOutAlt, faUserFriends, faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme: Theme) => createStyles({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar: React.FC = () => {
  const classes = useStyles();

  const isAuthenticated = useSelector((state: UserStore) => state.isAuthenticated);

  const renderAuthenticated = (): React.ReactFragment => (
    <>
      <Button color="inherit" component={Link} to="/documents" startIcon={<FontAwesomeIcon icon={faFile} />}>Documents</Button>
      <Button color="inherit" component={Link} to="/identities" startIcon={<FontAwesomeIcon icon={faUserFriends} />}>Identities</Button>
      <Button color="inherit" component={Link} to="/debug" startIcon={<FontAwesomeIcon icon={faBug} />}>Debug</Button>
      <Button color="inherit" component={Link} to="/" startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}>Logout</Button>
    </>
  );

  const renderNotAuthenticated = (): React.ReactFragment => (
    <>
      <Button color="inherit" component={Link} to="/signup" startIcon={<FontAwesomeIcon icon={faUserPlus} />}>SignUp</Button>
      <Button color="inherit" component={Link} to="/login" startIcon={<FontAwesomeIcon icon={faSignInAlt} />}>Login</Button>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to="/">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>Showcase Web Cryptography API</Typography>
        {isAuthenticated ? renderAuthenticated() : renderNotAuthenticated()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
