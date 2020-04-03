import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Card, CardActions, CardContent, Grid, TextField, Typography, Tooltip,
} from '@material-ui/core';
import { encryptWithRSAOAEP } from 'src/Api/wca';
import { openSnackbar } from 'src/Store/ui/UIActions';
import style from 'src/Styles';

const RSAOAEPEncryption: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [defaultValue, setDefaultValue] = useState(' ');

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    encryptWithRSAOAEP(plaintext)
      .then((text) => {
        setDefaultValue('');
        setCiphertext(text);
      })
      .catch(() => dispatch(openSnackbar('Please double check your input!')));
  };

  return (
    <Card className={classes.debugForm}>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5" component="h2" color="primary">
            RSA-OAEP Encryption
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                required
                fullWidth
                rows="5"
                label="Plaintext"
                id="rsa-oaep-encryption-plaintext"
                name="rsa-oaep-encryption-plaintext"
                type="text"
                placeholder="Please enter the data, which should be encrypted."
                variant="outlined"
                value={plaintext}
                onChange={(
                  event: React.ChangeEvent<HTMLInputElement>,
                ): void => setPlaintext(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                fullWidth
                disabled
                rows="5"
                label="Ciphertext"
                defaultValue={defaultValue}
                id="rsa-oaep-encryption-ciphertext"
                name="rsa-oaep-encryption-ciphertext"
                type="text"
                variant="outlined"
                value={ciphertext}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Tooltip title="Encrypt">
            <Button color="primary" type="submit">
              Encrypt
            </Button>
          </Tooltip>
        </CardActions>
      </form>
    </Card>

  );
};

export default RSAOAEPEncryption;
