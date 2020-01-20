import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Typography, Grid, TextField, Button,
} from '@material-ui/core';
import { SIGN_UP, HOME } from 'src/Routes';
import { signInWithEmailPassword } from 'src/Api/firebase/authentication';
import style from 'src/Styles';

const SignIn: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    dispatch(signInWithEmailPassword(email, password, () => history.push(HOME)));
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12}>
          <Typography variant="h4">
          Login into your Account to continue
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
          Sign In
          </Button>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Link to={SIGN_UP}>
            {'Don\'t have an account? Sign Up'}
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignIn;
