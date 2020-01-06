import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardActions, CardContent, Grid, TextField, Typography,
} from '@material-ui/core';
import style from 'src/Styles';
import { encryptTextWithRSAOAEP } from 'src/Api/wca';
import { getKeyStorage } from 'src/Api/localforage';

const RSAOAEPEncryption: React.FC = () => {
  const classes = style();

  const [publicKey, setPublicKey] = useState();
  const [plaintext, setPlaintext] = useState();
  const [ciphertext, setCiphertext] = useState();

  useEffect(() => {
    getKeyStorage()
      .then((keyStorage) => keyStorage.rsaOAEP)
      .then((rsaOAEP) => setPublicKey(rsaOAEP.publicKey));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    encryptTextWithRSAOAEP(plaintext, publicKey).then((text) => setCiphertext(text));
  };

  return (
    <Card className={classes.debugForm}>
      <form noValidate onSubmit={handleSubmit}>
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
                id="plaintext"
                name="plaintext"
                type="plaintext"
                defaultValue="Please enter the data, which should be encrypted."
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
                id="ciphertext"
                name="ciphertext"
                type="ciphertext"
                variant="outlined"
                value={ciphertext}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button color="primary" type="submit">
              Encrypt
          </Button>
        </CardActions>
      </form>
    </Card>

  );
};

export default RSAOAEPEncryption;
