import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Card, CardActions, CardContent, Typography,
} from '@material-ui/core';
import { ApplicationState } from 'src/Store/ApplicationState';

const UserDetails: React.FC = () => {
  // const loading = useSelector((state: ApplicationState) => state.ui.loading);
  const user = useSelector((state: ApplicationState) => state.user.user);

  // const dispatch = useDispatch();

  const handleEdit = () => {
    console.log(1);
  };

  const deleteAccount = () => {

  };

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2" color="primary">
            User Details
        </Typography>
        <Typography component="p" variant="body2" color="textSecondary">
          {`Username: ${user?.displayName}`}
        </Typography>
        <Typography component="p" variant="body2" color="textSecondary">
          {`E-Mail: ${user?.email}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleEdit}>
            Change Account
        </Button>
        <Button size="small" color="primary" onClick={deleteAccount}>
            Delete Account
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserDetails;
