import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  DialogContentText, Grid, Tooltip,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';
import { closeDialog, CloseDialogAction } from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';
import { changeDisplayName } from 'src/Api/firebase/authentication';

const ChangeUsernameDialog: React.FC = () => {
  const dispatch = useDispatch();

  const openChangeUsername = useSelector(
    (state: ApplicationState) => state.ui.dialog === DialogType.CHANGE_USERNAME,
  );

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleChangeUsernameAccount = (
    event: React.MouseEvent<HTMLElement>,
  ): void => {
    event.preventDefault();
    dispatch(changeDisplayName(password, username));
    dispatch(closeDialog(DialogType.CHANGE_USERNAME));
  };

  return (
    <Dialog
      onClose={(): CloseDialogAction => dispatch(closeDialog())}
      aria-labelledby="customized-dialog-title"
      open={openChangeUsername}
    >
      <DialogTitle id="customized-dialog-title">
          Change Username
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
            To change your username, please enter your new username and password.
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="username"
              name="username"
              type="text"
              label="Enter new Username"
              value={username}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement>,
              ): void => setUsername(event.target.value)}
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
        <Tooltip title="Cancel">
          <Button
            onClick={(
            ): CloseDialogAction => dispatch(closeDialog(DialogType.CHANGE_USERNAME))}
            color="primary"
          >
            Cancel
          </Button>
        </Tooltip>
        <Tooltip title="Confirm">
          <Button
            color="primary"
            onClick={(
              event,
            ): void => handleChangeUsernameAccount(event)}
          >
            Confirm
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeUsernameDialog;
