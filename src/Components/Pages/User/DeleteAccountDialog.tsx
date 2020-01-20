import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText, Grid,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';
import { deleteAccount } from 'src/Api/firebase/authentication';
import { HOME } from 'src/Routes';
import { closeDialog, CloseDialogAction } from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';

const DeleteAccountDialog: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const openDeleteAccount = useSelector(
    (state: ApplicationState) => state.ui.dialog === DialogType.DELETE_ACCOUNT,
  );

  const [password, setPassword] = useState('');

  const handleDeleteAccount = (
    event: React.MouseEvent<HTMLElement>,
  ): void => {
    event.preventDefault();
    dispatch(deleteAccount(password, () => history.push(HOME)));
  };

  return (
    <Dialog
      onClose={(): CloseDialogAction => dispatch(closeDialog())}
      aria-labelledby="customized-dialog-title"
      open={openDeleteAccount}
    >
      <DialogTitle id="customized-dialog-title">
          Delete Account
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
            To delete your account, please enter your email and password.
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
              onChange={(
                event: React.ChangeEvent<HTMLInputElement>,
              ): void => setPassword(event.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(
          ): CloseDialogAction => dispatch(closeDialog(DialogType.DELETE_ACCOUNT))}
          color="primary"
        >
            Cancel
        </Button>
        <Button
          color="primary"
          onClick={(
            event,
          ): void => handleDeleteAccount(event)}
        >
            Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog;
