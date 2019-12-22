import { createStyles, makeStyles, Theme } from '@material-ui/core';

const style = makeStyles((theme: Theme) => createStyles({
  form: {
    textAlign: 'center',
  },
  image: {
    margin: theme.spacing(1),
  },
  pageTitle: {
    marign: theme.spacing(1),
  },
  textField: {
    margin: theme.spacing(1),
  },
  button: {
    mariginTop: theme.spacing(1),
    position: 'relative',
  },
  customError: {
    margin: theme.spacing(1),
    fontSize: '0.8rem',
    color: 'red',
  },
  progress: {
    position: 'absolute',
  },
  avatar: {
    marign: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    display: 'inline-flex',
  },
  invisibleSeparator: {
    border: 'none',
    margin: 4,
  },
  visibleSeparator: {
    width: '100%',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(2),
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
