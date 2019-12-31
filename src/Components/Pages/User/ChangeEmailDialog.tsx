import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText, Grid,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';
import { changeEmail } from 'src/Api/firebase/authentication';
import { closeDialog, CloseDialogAction } from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';
import { useHistory } from 'react-router-dom';
import { HOME } from 'src/Routes';

const ChangeEmailDialog: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const openChangeEmail = useSelector(
    (state: ApplicationState) => state.ui.dialog === DialogType.CHANGE_EMAIL,
  );

  const currentEmail = useSelector((state: ApplicationState) => {
    const currentUser = state.user.user;
    if (currentUser && currentUser.email) {
      return currentUser.email;
    }
    return undefined;
  });
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    dispatch(changeEmail(currentEmail, password, newEmail, () => history.push(HOME)));
    dispatch(closeDialog(DialogType.CHANGE_EMAIL));
  };

  return (
    <Dialog
      onClose={(): CloseDialogAction => dispatch(closeDialog())}
      aria-labelledby="customized-dialog-title"
      open={openChangeEmail}
    >
      <DialogTitle id="customized-dialog-title">
          Change Email
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
        To change your email, please enter your new email and current password.
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="newEmail"
              name="newEmail"
              type="email"
              label="Enter new Email"
              value={newEmail}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement>,
              ): void => setNewEmail(event.target.value)}
            />
          </Grid>
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
          onClick={(): CloseDialogAction => dispatch(closeDialog(DialogType.CHANGE_EMAIL))}
          color="primary"
        >
            Cancel
        </Button>
        <Button
          color="primary"
          onClick={(event): void => handleChangeEmail(event)}
        >
            Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeEmailDialog;
