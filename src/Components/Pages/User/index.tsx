import React from 'react';
import style from 'src/Styles';
import {
  Avatar, Grid, Typography, Paper,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import UserDetails from './UserDetails';

const User: React.FC = () => {
  const classes = style();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faUser} />
        </Avatar>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4">User Management</Typography>
      </Grid>
      <Grid item xs={6}>
        <UserDetails />
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paperUser}>
          <Typography variant="h5" component="h3" color="primary">User Details</Typography>
          <Typography component="p">verfiy </Typography>
          <Typography component="p">Change e-mail </Typography>
          <Typography component="p">Change e-mail </Typography>
          <Typography component="p">Delete account</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paperUser}>
          <Typography variant="h5" component="h3" color="primary">Identity Settings</Typography>
          <Typography component="p">Name of Key: </Typography>
          <Typography component="p">Fingerprint: </Typography>
          <Typography component="p">Usage: </Typography>
          <Typography component="p">Export to Cloud: </Typography>
          <Typography component="p">Operations: </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default User;
