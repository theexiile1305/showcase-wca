import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Card, CardActions, CardContent, Typography,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';
import { openDialog, OpenDialogAction } from 'src/Store/ui/UIActions';
import DialogType from 'src/Models/DialogType';
import ExportKeyDialog from './ExportKeyDialog';

const KeyDetails: React.FC = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: ApplicationState) => state.user.user);

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color="primary">
            Key Details
          </Typography>
          <Typography component="p" variant="body2" color="textSecondary">
            {`Username: ${user?.displayName}`}
          </Typography>
          <Typography component="p" variant="body2" color="textSecondary">
            {`E-Mail: ${user?.email}`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={(): OpenDialogAction => dispatch(openDialog(DialogType.EXPORT_KEY))}
          >
            Export Key
          </Button>
        </CardActions>
      </Card>
      <ExportKeyDialog />
    </>
  );
};

export default KeyDetails;
