import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText, Grid,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';
import { closeDialog, CloseDialogAction } from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';
import exportKey from 'src/Api/wca';

const ExportKeyDialog: React.FC = () => {
  const dispatch = useDispatch();

  const openExportKey = useSelector((state: ApplicationState) => state.ui.dialog === DialogType.EXPORT_KEY);

  const [password, setPassword] = useState('');

  const handleExportKey = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    dispatch(exportKey(password));
    dispatch(closeDialog(DialogType.EXPORT_KEY));
  };

  return (
    <Dialog onClose={(): CloseDialogAction => dispatch(closeDialog())} aria-labelledby="customized-dialog-title" open={openExportKey}>
      <DialogTitle id="customized-dialog-title">
          Export Key
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
        Your private key will be gonna be exported to JSON Web Key Format.
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="password"
              name="password"
              type="password"
              label="Enter Password"
              value={password}
              onChange={
                (event: React.ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={(): CloseDialogAction => dispatch(closeDialog(DialogType.EXPORT_KEY))} color="primary">
            Cancel
        </Button>
        <Button color="primary" onClick={(event): void => dispatch(handleExportKey(event))}>
            Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportKeyDialog;
