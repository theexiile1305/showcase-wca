import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider, Grid, List, ListItem, ListItemText, ListItemIcon, Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { savePKI } from 'src/Store/pki/PKIActions';
import { determineEmail, listAllKeysFromPKI } from 'src/Api/firebase/firestore';
import { ApplicationState } from 'src/Store/ApplicationState';
import style from 'src/Styles';

const Documents: React.FC = () => {
  const classes = style();

  const dispatch = useDispatch();

  const emails = useSelector((state: ApplicationState) => state.pki.emails);

  useEffect(() => {
    listAllKeysFromPKI()
      .then((userIDs) => userIDs
        .map(async (userID) => dispatch(savePKI(await determineEmail(userID)))));
  }, [dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} className={classes.center}>
        <Typography variant="h4">Available Identities</Typography>
      </Grid>
      <Grid item xs={12}>
        <List component="nav">
          {emails.map((email) => (
            <React.Fragment key={email}>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={email}
                />
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
