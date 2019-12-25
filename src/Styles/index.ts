import { createStyles, makeStyles, Theme } from '@material-ui/core';

const style = makeStyles((theme: Theme) => createStyles({
  form: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  progress: {
    position: 'absolute',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    display: 'inline-flex',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  paperUser: {
    padding: theme.spacing(2),
    textAlign: 'left',
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
}));

export default style;
