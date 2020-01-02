import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid, Paper, Typography, Button,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import {
  IDENTITIES, DOCUMENTS, DEBUG, USER,
} from 'src/Routes';
import style from 'src/Styles';


const Home: React.FC = () => {
  const classes = style();

  const renderLink = (link: string, title: string): React.ReactFragment => (
    <Button
      color="primary"
      component={Link}
      to={link}
      startIcon={
        <LinkIcon />
      }
    >
      {title}
    </Button>
  );

  const renderPaper = (
    size: 12 | 6, title: string, text: string, link?: string,
  ): React.ReactFragment => (
    <Grid item xs={size}>
      <Paper className={classes.paper}>
        {link ? renderLink(link, title) : (
          <Typography variant="h5" component="h3" color="primary">
            {title}
          </Typography>
        )}
        <Typography component="p">{text}</Typography>
      </Paper>
    </Grid>
  );

  return (
    <Grid container spacing={3}>
      {renderPaper(
        12,
        'Welcome to the Shwocase of the Web Cryptography API',
        'In the course of my bachelor thesis \'Evaluation and Implementation of a secure cloud storage with the Web Cryptography API\' this application was implemented to show some basic cryptographic operations in web applications. This case study is a proof-of-concept to securely store, exchange and sign documents in the public cloud. Furthermore, all entities of the user- and identities management are encrypted on a client-side basis, enabling full end-to-end encryption.',
      )}
      {renderPaper(
        6,
        'User Management',
        'To use this application, you must register. A wide variety of settings can be made in user management. Just try it out for yourself!',
        USER,
      )}
      {renderPaper(
        6,
        'Identities Management',
        'In this section, all identities required for secure message exchange can be managed.',
        IDENTITIES,
      )}
      {renderPaper(
        12,
        'Secure Cloud Storage & Document Exchange',
        'All stored files are displayed in this table so that they can be downloaded or deleted. Of course, new files can also be uploaded or exchanged with a contact person. Nevertheless, the data exchange requires the public key of the communication partner. ',
        DOCUMENTS,
      )}
      {renderPaper(
        12,
        'Debug Information',
        'The debug section can be used to inspect cryptography keys and perform different cryptographic operations manually. Try it Out!',
        DEBUG,
      )}
    </Grid>
  );
};

export default Home;
