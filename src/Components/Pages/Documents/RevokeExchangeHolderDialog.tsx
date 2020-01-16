import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Grid,
  List, ListItem, ListItemIcon, ListItemText, Divider,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { ApplicationState } from 'src/Store/ApplicationState';
import {
  closeDialog, CloseDialogAction, OpenSnackbarAction, setUILoading, openSnackbar, clearUILoading,
} from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';
import { EmailByUserID } from 'src/Models/EmailByUserID';
import { listAllKeysFromPKI, determineEmail, revokeExchangeHolder } from 'src/Api/firebase/firestore';

const RevokeExchangeHolderDialog: React.FC = () => {
  const dispatch = useDispatch();

  const openRevokeExchangeHolder = useSelector(
    (state: ApplicationState) => state.ui.dialog === DialogType.REVOKE_EXCHANGE_HOLDER,
  );
  const currentUserID = useSelector((state: ApplicationState) => state.user.uid);
  const documentID = useSelector((state: ApplicationState) => state.documents.selected);

  const [users] = useState<EmailByUserID[]>([]);

  useEffect(() => {
    listAllKeysFromPKI()
      .then((userIDs) => userIDs
        .filter((userID) => userID !== currentUserID)
        .map(async (userID) => {
          const email = await determineEmail(userID);
          users.push({ userID, email });
        }));
  }, [dispatch, users, currentUserID]);

  const hanldeRevokeExchangeHolder = (
    userID: string,
  ): Promise<OpenSnackbarAction> => Promise
    .resolve(dispatch(setUILoading()))
    .then(() => {
      if (!documentID) {
        throw new Error('Document ID shall not be null.');
      }
      revokeExchangeHolder(userID, documentID);
    })
    .then(() => dispatch(openSnackbar('You`ve successfully revoked the sharing of the file.')))
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => {
      dispatch(clearUILoading());
      dispatch(closeDialog(DialogType.ADD_EXCHANGE_HOLDER));
    });

  return (
    <Dialog
      onClose={(): CloseDialogAction => dispatch(closeDialog())}
      aria-labelledby="customized-dialog-title"
      open={openRevokeExchangeHolder}
    >
      <DialogTitle id="customized-dialog-title">
          Revoke Exchange Holder
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
            To revoke the existing exchange holder, please enter the depending email.
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <List component="nav">
              {users.map((user: EmailByUserID) => (
                <React.Fragment key={user.userID}>
                  <ListItem
                    button
                    onClick={
                      (): Promise<OpenSnackbarAction> => hanldeRevokeExchangeHolder(user.userID)
                    }
                  >
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.email}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(): CloseDialogAction => dispatch(closeDialog(DialogType.REVOKE_EXCHANGE_HOLDER))}
          color="primary"
        >
            Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevokeExchangeHolderDialog;
