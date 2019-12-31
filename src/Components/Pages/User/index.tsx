import React from 'react';
import { Avatar, Grid, Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import style from 'src/Styles';
import UserDetails from './UserDetails';
import RSAOAEP from './RSAOAEP';
import RSAPSS from './RSAPSS';
import AESCBC from './AESCBC';

const User: React.FC = () => {
  const classes = style();

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={12} className={classes.center}>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faUser} />
        </Avatar>
      </Grid>
      <Grid item xs={12} className={classes.center}>
        <Typography variant="h4">User Management</Typography>
      </Grid>
      <Grid item xs={4} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs container spacing={1}>
            <UserDetails />
          </Grid>
          <Grid item xs>
            <AESCBC />
          </Grid>
        </Grid>
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
