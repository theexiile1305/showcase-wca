import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  Grid, Link, Typography,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';
import { closeDialog, CloseDialogAction } from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';

const ExchangedURLDialog: React.FC = () => {
  const dispatch = useDispatch();

  const openAddURL = useSelector(
    (state: ApplicationState) => state.ui.dialog === DialogType.ADD_URL,
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const url = useSelector((state: ApplicationState) => state.documents.url!!);

  return (
    <Dialog
      onClose={(): CloseDialogAction => dispatch(closeDialog())}
      aria-labelledby="customized-dialog-title"
      open={openAddURL}
    >
      <DialogTitle id="customized-dialog-title">
          Shared URL
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <Typography variant="body2">
            <Link href={url}>
              {url}
            </Link>
          </Typography>
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(
          ): CloseDialogAction => dispatch(closeDialog(DialogType.ADD_URL))}
          color="primary"
        >
            Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExchangedURLDialog;
