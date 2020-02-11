import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Divider, Grid, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, ListItemIcon, Typography, Button, Tooltip,
} from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ClearIcon from '@material-ui/icons/Clear';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DeleteIcon from '@material-ui/icons/Delete';
import { ApplicationState } from 'src/Store/ApplicationState';
import { downloadDocument } from 'src/Api/firebase/storage';
import {
  setUILoading, openSnackbar, clearUILoading, OpenSnackbarAction, openDialog,
} from 'src/Store/ui/UIActions';
import saveData from 'src/Api/saveData';
import { removeDocuments, addSelected } from 'src/Store/documents/DocumentActions';
import DialogType from 'src/Models/DialogType';
import style from 'src/Styles';
import { listDocumentReferences, uploadDocumentReferences, deleteDocumentReference } from 'src/Api/firebase/firestore';
import { useHistory } from 'react-router-dom';
import { HOME } from 'src/Routes';
import AddExchangeHolderDialog from './AddExchangeHolderDialog';
import RevokeExchangeHolderDialog from './RevokeExchangeHolderDialog';
import ExchangedURLDialog from './ExchangedURLDialog';

Index;

const Documents: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();
  const history = useHistory();

  const documents = useSelector((state: ApplicationState) => state.documents.documents);
  const uid = useSelector((state: ApplicationState) => state.user.uid);

  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (uid) {
      Promise
        .resolve(dispatch(setUILoading()))
        .then(() => dispatch(removeDocuments()))
        .then(() => dispatch(listDocumentReferences(uid)))
        .catch((error) => dispatch(openSnackbar(error.message)))
        .finally(() => dispatch(clearUILoading()));
    }
    if (updated) {
      setUpdated(!updated);
    }
  }, [uid, dispatch, updated]);

  const hanldeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void | OpenSnackbarAction> => Promise
    .resolve(dispatch(setUILoading()))
    .then(async () => {
      const { files } = event.target;
      if (uid && files) {
        await uploadDocumentReferences(uid, files);
      }
    })
    .then(() => dispatch(openSnackbar('You`ve successfully uploaded the file.')))
    .then(() => history.push(HOME))
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => {
      setUpdated(true);
      dispatch(clearUILoading());
    });

  const handleDownload = (
    path: string, filename: string,
  ): Promise<OpenSnackbarAction> => Promise
    .resolve(dispatch(setUILoading()))
    .then(() => downloadDocument(path))
    .then((blob) => saveData(blob, filename))
    .then(() => dispatch(openSnackbar('You`ve successfully downloaded the file.')))
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => dispatch(clearUILoading()));


  const handleDelete = (
    id: string, path: string,
  ): Promise<OpenSnackbarAction> => Promise
    .resolve(dispatch(setUILoading()))
    .then(() => deleteDocumentReference(id, path))
    .then(() => dispatch(openSnackbar('You`ve successfully deleted the file.')))
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => {
      setUpdated(true);
      dispatch(clearUILoading());
    });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6} className={classes.center}>
          <Typography variant="h4">Documents</Typography>
        </Grid>
        <Grid item xs={6} className={classes.center}>
          <label htmlFor="upload-button">
            <input
              accept="media_type"
              id="upload-button"
              type="file"
              className={classes.input}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement>,
              ): Promise<void | OpenSnackbarAction> => {
                event.persist();
                return hanldeUpload(event);
              }}
            />
            <Tooltip title="Upload">
              <Button
                variant="outlined"
                color="primary"
                component="span"
              >
          Upload
              </Button>
            </Tooltip>
          </label>
        </Grid>
        <Grid item xs={12}>
          <List component="nav">
            {documents.map((document) => (
              <React.Fragment key={document.id}>
                <Tooltip title="Download">
                  <ListItem
                    button
                    onClick={(
                    ): Promise<OpenSnackbarAction> => handleDownload(
                      document.path, document.filename,
                    )}
                  >
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary={document.filename} />
                    <ListItemSecondaryAction>
                      <Tooltip title="Revoke an exchange holder">
                        <IconButton
                          edge="end"
                          onClick={(): void => {
                            dispatch(addSelected(document.id));
                            dispatch(openDialog(DialogType.REVOKE_EXCHANGE_HOLDER));
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add an exhcnage holder">
                        <IconButton
                          edge="end"
                          onClick={(): void => {
                            dispatch(addSelected(document.id));
                            dispatch(openDialog(DialogType.ADD_EXCHANGE_HOLDER));
                          }}
                        >
                          <AutorenewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          onClick={
                            (): Promise<OpenSnackbarAction> => handleDelete(
                              document.id, document.path,
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Tooltip>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
      <AddExchangeHolderDialog />
      <RevokeExchangeHolderDialog />
      <ExchangedURLDialog />
    </>
  );
};

export default Documents;
