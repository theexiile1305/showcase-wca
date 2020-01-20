import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Grid, Typography, TextField, Button, Tooltip,
} from '@material-ui/core';
import { signUp } from 'src/Api/firebase/authentication';
import { SIGN_IN, HOME } from 'src/Routes';
import style from 'src/Styles';

const SignUp: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const history = useHistory();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    dispatch(signUp(username, email, password, () => history.push(HOME)));
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12}>
          <Typography variant="h4">
          Create a new Account to continue
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="username"
            name="username"
            type="text"
            label="Enter Username"
            autoComplete="username"
            value={username}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement>,
            ): void => setUsername(event.target.value)}
          />
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
            autoComplete="email"
            value={email}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement>,
            ): void => setEmail(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="password"
            name="password"
            type="password"
            label="Enter Password"
            autoComplete="password"
            value={password}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement>,
            ): void => setPassword(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Tooltip title="Sign Up">
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
        Sign Up
            </Button>
          </Tooltip>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Link to={SIGN_IN}>
            {'You\'ve already an account? Sign In'}
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignUp;
