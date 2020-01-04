import React, { useEffect } from 'react';
import {
  Divider, Grid, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, ListItemIcon, Typography, Button,
} from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DeleteIcon from '@material-ui/icons/Delete';
import style from 'src/Styles';
import {
  listAllDocuments, deleteDocument, downloadDocument, uploadDocuments,
} from 'src/Api/firebase/storage';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from 'src/Store/ApplicationState';

const Documents: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const documents = useSelector((state: ApplicationState) => state.documents.documents);
  const user = useSelector((state: ApplicationState) => state.user.user);

  useEffect(() => {
    if (user) {
      dispatch(listAllDocuments(user.uid));
    }
  }, [dispatch, user]);

  const hanldeUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = event.target;
    if (user && files) {
      dispatch(uploadDocuments(user.uid, files));
    }
  };

  const handleDownload = (filename: string): void => {
    if (user) {
      downloadDocument(user.uid, filename);
    }
  };

  const handleDelete = (filename: string): void => {
    if (user) {
      dispatch(deleteDocument(user.uid, filename));
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} className={classes.center}>
        <Typography variant="h4">Documents</Typography>
      </Grid>
      <Grid item xs={6} className={classes.center}>
        <label htmlFor="upload-button">
          <input
            accept="media_type"
            id="upload-button"
            multiple
            type="file"
            className={classes.input}
            onChange={hanldeUpload}
          />
          <Button
            variant="outlined"
            color="primary"
            component="span"
          >
          Upload
          </Button>
        </label>
      </Grid>
      <Grid item xs={12}>
        <List component="nav">
          {documents.map((document) => (
            <React.Fragment key={document.id}>
              <ListItem button onClick={(): void => handleDownload(document.filename)}>
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary={document.filename} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={(): void => handleDelete(document.filename)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default Documents;
