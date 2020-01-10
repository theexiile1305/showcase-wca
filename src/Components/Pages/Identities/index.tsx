import React, { useEffect } from 'react';
import {
  Divider, Grid, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, ListItemIcon, Typography,
} from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DeleteIcon from '@material-ui/icons/Delete';
import style from 'src/Styles';
import { listSharedPublicKeys, exchangeKey, deleteExchangeKey } from 'src/Api/firebase/storage';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from 'src/Store/ApplicationState';

const Documents: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const sharedPublicKeys = useSelector(
    (state: ApplicationState) => state.documents.sharedPublicKeys,
  );
  const uid = useSelector((state: ApplicationState) => state.user.uid);

  useEffect(() => {
    if (uid) {
      dispatch(listSharedPublicKeys());
    }
  }, [dispatch, uid]);

  const handleExchange = (exchangeUserID: string, url: string): void => {
    if (uid) {
      dispatch(exchangeKey(uid, exchangeUserID, url));
    }
  };

  const handleDeleteExchange = (exchangeUserID: string): void => {
    if (uid) {
      dispatch(deleteExchangeKey(uid, exchangeUserID));
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} className={classes.center}>
        <Typography variant="h4">Identities</Typography>
      </Grid>
      <Grid item xs={12}>
        <List component="nav">
          {sharedPublicKeys.map((sharedPublicKey) => (
            <React.Fragment key={sharedPublicKey.userID}>
              <ListItem
                button
                onClick={
                  (): void => handleExchange(
                    sharedPublicKey.userID, sharedPublicKey.rsaOAEP.downloadURL,
                  )
                }
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={sharedPublicKey.userID}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={
                      (): void => handleDeleteExchange(sharedPublicKey.userID)
                    }
                  >
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
