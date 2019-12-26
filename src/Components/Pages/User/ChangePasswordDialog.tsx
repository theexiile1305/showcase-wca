import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText, Grid,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';
import { changePassword } from 'src/Api/authentication';
import { closeDialog, CloseDialogAction } from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';
import { HOME } from 'src/Routes';
import { useHistory } from 'react-router-dom';

const ChangePasswordDialog: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const openChangePassword = useSelector((state: ApplicationState) => state.ui.dialog === DialogType.CHANGE_PASSWORD);

  const email = useSelector((state: ApplicationState) => {
    const currentUser = state.user.user;
    if (currentUser && currentUser.email) {
      return currentUser.email;
    }
    return undefined;
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    dispatch(changePassword(email, currentPassword, newPassword, () => history.push(HOME)));
    dispatch(closeDialog(DialogType.CHANGE_PASSWORD));
  };

  return (
    <Dialog onClose={(): CloseDialogAction => dispatch(closeDialog())} aria-labelledby="customized-dialog-title" open={openChangePassword}>
      <DialogTitle id="customized-dialog-title">
          Change Password
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
            To change your password, please enter your current and new password.
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Enter current Password"
              value={currentPassword}
              onChange={
                (event: React.ChangeEvent<HTMLInputElement>): void => setCurrentPassword(event.target.value)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="newPassword"
              name="newPassword"
              type="password"
              label="Enter new Password"
              value={newPassword}
              onChange={
                (event: React.ChangeEvent<HTMLInputElement>): void => setNewPassword(event.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={(): CloseDialogAction => dispatch(closeDialog(DialogType.CHANGE_PASSWORD))} color="primary">
            Cancel
        </Button>
        <Button color="primary" onClick={(event): void => handlePasswordChange(event)}>
            Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
