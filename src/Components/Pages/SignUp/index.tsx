import React, { useState } from 'react';
import {
  Grid, Avatar, Typography, TextField, CircularProgress, Button,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import style from 'src/Styles';
import { signUp } from 'src/Api/firebase/authentication';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { SIGN_IN, HOME } from 'src/Routes';
import { ApplicationState } from 'src/Store/ApplicationState';

const SignUp: React.FC = () => {
  const classes = style();

  const loading = useSelector((state: ApplicationState) => state.ui.loading);

  const dispatch = useDispatch();
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatch(signUp(username, email, password, () => history.push(HOME)));
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12}>
          <Avatar className={classes.avatar}>
            <FontAwesomeIcon icon={faUserPlus} />
          </Avatar>
        </Grid>
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
            value={username}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>): void => setUsername(event.target.value)
            }
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
            value={email}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)
            }
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
            value={password}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)
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
        Sign Up
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
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
