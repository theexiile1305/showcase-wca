import React, { useState } from 'react';
import {
  Grid, Avatar, Typography, TextField, CircularProgress, Button,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import style from 'src/Styles';
import { signUpWithEmailPassword } from 'src/Api/authentication';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { SIGN_IN, HOME } from 'src/Routes';
import { ApplicationState } from 'src/Store/ApplicationState';

const SignUp: React.FC = () => {
  const classes = style();

  const loading = useSelector((state: ApplicationState) => state.ui.loading);

  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatch(signUpWithEmailPassword(email, password, () => history.push(HOME)));
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faUserPlus} />
        </Avatar>
        <Typography variant="h4" className={classes.pageTitle}>
          Create a new Account to continue
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
        Sign Up
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <small>
            <Grid container>
              <Grid item xs />
              <Grid item xs>
                <Link to={SIGN_IN}>
                  {'You\'ve already an account? Sign In'}
                </Link>
              </Grid>
            </Grid>
          </small>
        </form>
      </Grid>
    </Grid>
  );
};

export default SignUp;
