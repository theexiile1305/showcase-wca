import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import style from 'src/Styles';
import { ApplicationState } from 'src/Store/ApplicationState';
import { closeSnackbar, CloseSnackbarAction } from 'src/Store/ui/UIActions';

const SimpleSnackbar: React.FC = () => {
  const classes = style();
  const dispatch = useDispatch();
  const handleClose = (): CloseSnackbarAction => dispatch(closeSnackbar());
  const snackbar = useSelector((state: ApplicationState) => state.ui.snackbar);

  return (
    <Snackbar
      className={classes.snackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={!!snackbar}
      autoHideDuration={6000}
      onClose={handleClose}
      ContentProps={{ 'aria-describedby': 'message-id' }}
      message={(<span id="message-id">{snackbar?.message}</span>)}
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
};

export default SimpleSnackbar;
