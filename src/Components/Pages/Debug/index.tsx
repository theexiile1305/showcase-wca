import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import style from 'src/Styles';
import AESCBCEncryption from './AESCBCEncryption';
import AESCBCDecryption from './AESCBCDecryption';
import RSAOAEPEncryption from './RSAOAEPEncryption';
import RSAOAEPDecryption from './RSAOAEPDecryption';
import RSAPSSSigning from './RSAPSSSigning';
import RSAPSSVerifing from './RSAPSSVerifing';

const Debug: React.FC = () => {
  const classes = style();

  return (
    <Grid container alignItems="center" spacing={4}>
      <Grid item xs={12} className={classes.center}>
        <Typography variant="h4">Debug</Typography>
      </Grid>
      <Grid item xs={6}>
        <AESCBCEncryption />
      </Grid>
      <Grid item xs={6}>
        <AESCBCDecryption />
      </Grid>
      <Grid item xs={6}>
        <RSAOAEPEncryption />
      </Grid>
      <Grid item xs={6}>
        <RSAOAEPDecryption />
      </Grid>
      <Grid item xs={6}>
        <RSAPSSSigning />
      </Grid>
      <Grid item xs={6}>
        <RSAPSSVerifing />
      </Grid>
    </Grid>
  );
};

export default Debug;
