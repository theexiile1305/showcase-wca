import React, { useEffect } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { getDocumentPathFromHash } from 'src/Api/firebase/firestore';
import {
  setUILoading, clearUILoading, openSnackbar,
} from 'src/Store/ui/UIActions';
import { downloadDocument } from 'src/Api/firebase/storage';
import saveData from 'src/Api/saveData';
import { useDispatch } from 'react-redux';

const Exchange: React.FC = () => {
  const dispatch = useDispatch();
  const { hash } = useParams();

  useEffect(() => {
    if (hash === undefined) {
      throw new Error('Invalid link. Please double check it!');
    }
    Promise.resolve(dispatch(setUILoading()))
      .then(() => getDocumentPathFromHash(hash))
      .then((path) => downloadDocument(path))
      .then((blob) => saveData(blob, 'sharedDocument'))
      .then(() => dispatch(openSnackbar('You`ve successfully downloaded the file.')))
      .catch((error) => dispatch(openSnackbar(error.message)))
      .finally(() => dispatch(clearUILoading()));
  }, [dispatch, hash]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">
          The exchange file is going to be downloaded soon!
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Exchange;
