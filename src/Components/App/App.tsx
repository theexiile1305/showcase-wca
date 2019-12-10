import React from 'react';
import { Switch, Route } from 'react-router';
import store from 'src/Store';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/styles';
import Navbar from '../Layout/Navbar';
import Home from '../Pages/Home';
import SignUp from '../Pages/SignUp';
import Login from '../Pages/Login';
import './App.css';
import Footer from '../Layout/Footer';
import Documents from '../Pages/Documents';
import Debug from '../Pages/Debug';
import Identities from '../Pages/Identities';

const useStyles = makeStyles(() => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
}));

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <HashRouter>
        <div className={classes.root}>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/documents" component={Documents} />
            <Route exact path="/identities" component={Identities} />
            <Route exact path="/debug" component={Debug} />
          </Switch>
          <Footer />
        </div>
      </HashRouter>
    </Provider>
  );
};

export default App;
