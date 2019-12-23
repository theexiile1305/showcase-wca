import React from 'react';
import { Typography, Container, Link } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import style from 'src/Styles';

const Footer: React.FC = () => {
  const classes = style();

  const renderContribution = (): React.ReactFragment => (
    <Typography variant="body1">
      {'Built with '}
      <FontAwesomeIcon color="red" icon={faHeart} />
      {' by '}
      <Link color="inherit" href="https://reactjs.org/">React</Link>
      {' on '}
      <Link color="inherit" href="https://circleci.com/gh/theexiile1305/showcase-wca/tree/master">CircleCI</Link>
      {' - Please report all issues on '}
      <Link color="inherit" href="https://github.com/theexiile1305/showcase-wca/issues">GitHub</Link>
    </Typography>
  );

  const renderCopyright = (): React.ReactFragment => (
    <Typography variant="body2" color="textSecondary">
      {' © '}
      {new Date().getFullYear()}
      {' '}
      <Link color="inherit" href="https://github.com/theexiile1305/">Michael Fuchs</Link>
      {' // Many thanks for the good support from '}
      <Link color="inherit" href="https://www.inovex.de/de/">inovex GmbH</Link>
    </Typography>
  );

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        {renderContribution()}
        {renderCopyright()}
      </Container>
    </footer>
  );
};

export default Footer;
