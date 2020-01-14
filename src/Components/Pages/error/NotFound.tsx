import React from 'react';
import { Typography, Grid } from '@material-ui/core';

const NotFound: React.FC = () => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Typography variant="h4">
          Requested site was not found!
      </Typography>
    </Grid>
    <Grid item xs={12} />
  </Grid>
);

export default NotFound;
