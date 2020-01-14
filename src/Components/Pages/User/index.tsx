import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import style from 'src/Styles';
import UserDetails from './UserDetails';
import RSAOAEP from './RSAOAEP';
import RSAPSS from './RSAPSS';

const User: React.FC = () => {
  const classes = style();

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={12} className={classes.center}>
        <Typography variant="h4">User Management</Typography>
      </Grid>
      <Grid item xs={4}>
        <UserDetails />
      </Grid>
      <Grid item xs={4}>
        <RSAOAEP />
      </Grid>
      <Grid item xs={4}>
        <RSAPSS />
      </Grid>
    </Grid>
  );
};

export default User;
