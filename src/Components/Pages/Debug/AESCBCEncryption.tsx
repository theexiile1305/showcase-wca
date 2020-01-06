import React, { useState } from 'react';
import {
  Button, Card, CardActions, CardContent, Grid, TextField, Typography,
} from '@material-ui/core';
import style from 'src/Styles';
import { encryptTextWithAES } from 'src/Api/wca';
import { openSnackbar } from 'src/Store/ui/UIActions';
import { useDispatch } from 'react-redux';

const AESCBCEncryption: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const [plaintext, setPlaintext] = useState();
  const [ciphertext, setCiphertext] = useState();
  const [defaultValue, setDefaultValue] = useState(' ');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    encryptTextWithAES(plaintext)
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
            AES-CBC Encryption
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                required
                fullWidth
                rows="5"
                label="Plaintext"
                id="aes-cbc-encryption-plaintext"
                name="aes-cbc-encryption-plaintext"
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
                label="Chiphertext"
                defaultValue={defaultValue}
                id="aes-cbc-encryption-ciphertext"
                name="aes-cbc-encryption-ciphertext"
                type="text"
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

export default AESCBCEncryption;
