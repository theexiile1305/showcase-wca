import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Card, CardActions, CardContent, Typography, Tooltip,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';
import { openDialog, OpenDialogAction } from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';
import ChangeUsernameDialog from './ChangeUsernameDialog';
import ChangeEmailDialog from './ChangeEmailDialog';
import DeleteAccountDialog from './DeleteAccountDialog';

const UserDetails: React.FC = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: ApplicationState) => state.user);

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color="primary">
            User Details
          </Typography>
          <Typography component="p" variant="body2" color="textSecondary">
            {`Username: ${user.displayName}`}
          </Typography>
          <Typography component="p" variant="body2" color="textSecondary">
            {`E-Mail: ${user.email}`}
          </Typography>
        </CardContent>
        <CardActions>
          <Tooltip title="Change Username">
            <Button
              size="small"
              color="primary"
              onClick={(
              ): OpenDialogAction => dispatch(openDialog(DialogType.CHANGE_USERNAME))}
            >
            Change Username
            </Button>
          </Tooltip>
          <Tooltip title="Change E-Mail">
            <Button
              size="small"
              color="primary"
              onClick={(
              ): OpenDialogAction => dispatch(openDialog(DialogType.CHANGE_EMAIL))}
            >
            Change E-Mail
            </Button>
          </Tooltip>
          <Tooltip title="Delete Account">
            <Button
              size="small"
              color="primary"
              onClick={(
              ): OpenDialogAction => dispatch(openDialog(DialogType.DELETE_ACCOUNT))}
            >
            Delete Account
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
      <ChangeUsernameDialog />
      <ChangeEmailDialog />
      <DeleteAccountDialog />
    </>
  );
};

export default UserDetails;
