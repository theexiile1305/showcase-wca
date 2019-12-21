import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from 'src/Styles';
import { ApplicationState } from 'src/Store/ApplicationState';
import { resetPassword } from 'src/Api/authentication';
import {
  Grid, Avatar, TextField, Typography, Button, CircularProgress,
} from '@material-ui/core';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HOME } from 'src/Routes';
import { useHistory } from 'react-router-dom';


const ResetPassword: React.FC = () => {
  const classes = style();

  const loading = useSelector((state: ApplicationState) => state.ui.loading);

  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState('');

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatch(resetPassword(email, () => history.push(HOME)));
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faUnlock} />
        </Avatar>
        <Typography variant="h4" className={classes.pageTitle}>
          Reset your password to continue
        </Typography>
        <form noValidate onSubmit={handleResetPassword}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
        Reset your Password
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
