import React, { useEffect } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  setUILoading, clearUILoading, openSnackbar,
} from 'src/Store/ui/UIActions';
import { downloadDocument } from 'src/Api/firebase/storage';
import { getDocumentPathFromHash } from 'src/Api/firebase/firestore';
import saveData from 'src/Api/saveData';

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
      .then((blob) => {
        const fileExtension = hash.substring(hash.indexOf('.'));
        saveData(blob, `sharedDocument${fileExtension}`);
      })
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
