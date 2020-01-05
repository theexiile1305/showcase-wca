import React, { useEffect } from 'react';
import {
  Divider, Grid, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, ListItemIcon, Typography,
} from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MailIcon from '@material-ui/icons/Mail';
import style from 'src/Styles';
import { listSharedPublicKeys } from 'src/Api/firebase/storage';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from 'src/Store/ApplicationState';

const Documents: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const sharedPublicKeys = useSelector(
    (state: ApplicationState) => state.documents.sharedPublicKeys,
  );
  const user = useSelector((state: ApplicationState) => state.user.user);

  useEffect(() => {
    if (user) {
      dispatch(listSharedPublicKeys());
    }
  }, [dispatch, user]);

  const handleExchange = (userID: string): void => {
    window.alert(userID);
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
              <ListItem>
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={sharedPublicKey.userID}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(): void => handleExchange(sharedPublicKey.userID)}
                  >
                    <MailIcon />
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
