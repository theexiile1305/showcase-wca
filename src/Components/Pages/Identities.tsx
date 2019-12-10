import React from 'react';
import {
  Container, createStyles, makeStyles, Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
}));

const Identities: React.FC = () => {
  const classes = useStyles();

  return (
    <Container component="main" className={classes.main} maxWidth="sm">
      <div>Identities</div>
    </Container>
  );
};

export default Identities;
