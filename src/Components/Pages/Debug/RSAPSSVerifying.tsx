import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Card, CardActions, CardContent, Grid, TextField, Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { openSnackbar } from 'src/Store/ui/UIActions';
import { verifyWithRSAPSS } from 'src/Api/wca';
import style from 'src/Styles';

const RSAPSSVerifying: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();
  const [message, setMessage] = useState();
  const [signature, setSignature] = useState();
  const [valid, setValid] = useState();

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    verifyWithRSAPSS(message, signature)
      .then((isValid) => setValid(isValid))
      .catch(() => dispatch(openSnackbar('Please double check your inputs!')));
  };

  return (
    <Card className={classes.debugForm}>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5" component="h2" color="primary">
            RSA-PSS Verifing
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                required
                fullWidth
                rows="5"
                id="rsa-pss-verifying-message"
                name="rsa-pss-verifyingmessage"
                type="text"
                label="Message"
                placeholder="Please enter your message, which should be verified."
                variant="outlined"
                value={message}
                onChange={(
                  event: React.ChangeEvent<HTMLInputElement>,
                ): void => setMessage(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                required
                fullWidth
                rows="5"
                id="rsa-pss-verifying-signature"
                name="rsa-pss-verifying-signature"
                type="text"
                label="Signature"
                placeholder="Please enter your signature."
                variant="outlined"
                value={signature}
                onChange={(
                  event: React.ChangeEvent<HTMLInputElement>,
                ): void => setSignature(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                {'Message valid with given signature: '}
                {valid ? (
                  <DoneIcon htmlColor="#228B22" />
                ) : (
                  <CloseIcon htmlColor="#FF0000" />
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button color="primary" type="submit">
              Verify
          </Button>
        </CardActions>
      </form>
    </Card>

  );
};

export default RSAPSSVerifying;
