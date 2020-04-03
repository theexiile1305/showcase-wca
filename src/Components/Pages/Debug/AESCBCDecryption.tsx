import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Card, CardActions, CardContent, Grid, TextField, Typography, Tooltip,
} from '@material-ui/core';
import { decryptWithAESCBC } from 'src/Api/wca';
import { openSnackbar } from 'src/Store/ui/UIActions';
import style from 'src/Styles';

const AESCBCDecryption: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [defaultValue, setDefaultValue] = useState(' ');

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    decryptWithAESCBC(ciphertext)
      .then((text) => {
        setDefaultValue('');
        setPlaintext(text);
      })
      .catch(() => dispatch(openSnackbar('Please double check your input!')));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className={classes.debugForm}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5" component="h2" color="primary">
            AES-CBC Decryption
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                required
                fullWidth
                rows="5"
                label="Ciphertext in Base64"
                id="aes-cbc-decryption-ciphertext"
                name="aes-cbc-decryption-ciphertext"
                placeholder="Please enter the data, which should be decrypted."
                type="text"
                variant="outlined"
                value={ciphertext}
                onChange={(
                  event: React.ChangeEvent<HTMLInputElement>,
                ): void => setCiphertext(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                fullWidth
                disabled
                rows="5"
                label="Plaintext"
                defaultValue={defaultValue}
                id="aes-cbc-decryption-plaintext"
                name="aes-cbc-decryption-plaintext"
                type="text"
                variant="outlined"
                value={plaintext}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Tooltip title="Decrypt">
            <Button color="primary" type="submit">
              Decrypt
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
    </form>
  );
};

export default AESCBCDecryption;
