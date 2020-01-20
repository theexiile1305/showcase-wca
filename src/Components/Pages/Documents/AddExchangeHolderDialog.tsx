import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  Grid, List, ListItem, ListItemIcon, ListItemText, Divider,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { ApplicationState } from 'src/Store/ApplicationState';
import {
  closeDialog, CloseDialogAction, setUILoading, clearUILoading,
  openSnackbar, OpenSnackbarAction, openDialog,
} from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';
import { EmailByUserID } from 'src/Models/EmailByUserID';
import { addUrl } from 'src/Store/documents/DocumentActions';
import { listAllKeysFromPKI, determineEmail, addExchangeHolder } from 'src/Api/firebase/firestore';

const AddExchangeHolderDialog: React.FC = () => {
  const dispatch = useDispatch();

  const openAddExchangeHolder = useSelector(
    (state: ApplicationState) => state.ui.dialog === DialogType.ADD_EXCHANGE_HOLDER,
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

  const hanldeAddExchangeHolder = (
    userID: string,
  ): Promise<OpenSnackbarAction> => Promise
    .resolve(dispatch(setUILoading()))
    .then(() => {
      if (!documentID) {
        throw new Error('Document ID shall not be null.');
      }
      return addExchangeHolder(userID, documentID);
    })
    .then((link) => {
      navigator.clipboard.writeText(link);
      dispatch(addUrl(link));
    })
    .then(() => dispatch(openSnackbar('File location was successfully copied to clipboard.')))
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => {
      dispatch(clearUILoading());
      dispatch(closeDialog(DialogType.ADD_EXCHANGE_HOLDER));
      dispatch(openDialog(DialogType.ADD_URL));
    });

  return (
    <Dialog
      onClose={(): CloseDialogAction => dispatch(closeDialog())}
      aria-labelledby="customized-dialog-title"
      open={openAddExchangeHolder}
    >
      <DialogTitle id="customized-dialog-title">
          Add Exchange Holder
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
            To add an additional exchange holder, please enter the depending email.
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <List component="nav">
              {users.map((user: EmailByUserID) => (
                <React.Fragment key={user.userID}>
                  <ListItem
                    button
                    onClick={(
                    ): Promise<OpenSnackbarAction> => hanldeAddExchangeHolder(user.userID)}
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
          onClick={(
          ): CloseDialogAction => dispatch(closeDialog(DialogType.ADD_EXCHANGE_HOLDER))}
          color="primary"
        >
            Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExchangeHolderDialog;
