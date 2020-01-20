import { createStyles, makeStyles, Theme } from '@material-ui/core';

const style = makeStyles((theme: Theme) => createStyles({
  center: {
    textAlign: 'center',
  },
  form: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  debugForm: {
    textAlign: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  navbarTitle: {
    flexGrow: 1,
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
  },
  snackbar: {
    backgroundColor: theme.palette.primary.main,
  },
  input: {
    display: 'none',
  },
}));

export default style;
