import React from 'react';
import { Avatar, Grid, Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import style from 'src/Styles';
import UserDetails from './UserDetails';
import KeyDetails from './KeyDetails';

const User: React.FC = () => {
  const classes = style();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.center}>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faUser} />
        </Avatar>
      </Grid>
      <Grid item xs={12} className={classes.center}>
        <Typography variant="h4">User Management</Typography>
      </Grid>
      <Grid item xs={4}>
        <UserDetails />
      </Grid>
      <Grid item xs={8}>
        <KeyDetails />
      </Grid>
    </Grid>
  );
};

export default User;
