import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography, Avatar, Grid, TextField, Button, CircularProgress,
} from '@material-ui/core';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from 'src/Styles';
import { ApplicationState } from 'src/Store/ApplicationState';
import { SIGN_UP, RESET_PASSWORD } from 'src/Routes';
import { signInWithEmailPassword } from 'src/Api/authentication';

const SignIn: React.FC = () => {
  const classes = style();

  const loading = useSelector((state: ApplicationState) => state.ui.loading);

  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatch(signInWithEmailPassword(email, password));
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faSignInAlt} />
        </Avatar>
        <Typography variant="h4" className={classes.pageTitle}>
          Login into your Account to continue
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            name="email"
            type="email"
            label="Enter Email"
            className={classes.textField}
            value={email}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)
            }
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            id="password"
            name="password"
            type="password"
            label="Enter Password"
            className={classes.textField}
            value={password}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
        Login
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            <Grid container>
              <Grid item xs>
                <Link to={RESET_PASSWORD}>Forgot Password?</Link>
              </Grid>
              <Grid item xs>
                <Link to={SIGN_UP}>
                  {'Don\'t have an account? Sign Up'}
                </Link>
              </Grid>
            </Grid>
          </small>
        </form>
      </Grid>
    </Grid>
  );
};

export default SignIn;
