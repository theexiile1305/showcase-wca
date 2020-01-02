import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from 'src/Styles';
import { ApplicationState } from 'src/Store/ApplicationState';
import { resetPassword } from 'src/Api/firebase/authentication';
import {
  Grid, Avatar, TextField, Typography, Button, CircularProgress,
} from '@material-ui/core';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { HOME } from 'src/Routes';
import { useHistory } from 'react-router-dom';


const ResetPassword: React.FC = () => {
  const classes = style();

  const loading = useSelector((state: ApplicationState) => state.ui.loading);

  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatch(resetPassword(email, () => history.push(HOME)));
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12}>
          <Avatar className={classes.avatar}>
            <LockOpenIcon />
          </Avatar>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">
          Reset your password to continue
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            name="email"
            type="email"
            label="Enter Email"
            value={email}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
        Reset your Password
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ResetPassword;
