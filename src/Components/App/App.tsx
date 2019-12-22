import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import 'src/Assets/App.css';
import { Provider } from 'react-redux';
import store from 'src/Store';
import {
  HOME, SIGN_IN, SIGN_UP, DOCUMENTS, IDENTITIES, DEBUG, RESET_PASSWORD,
} from 'src/Routes';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import Home from '../Pages/Home';
import SignUp from '../Pages/SignUp';
import SignIn from '../Pages/SignIn';
import Documents from '../Pages/Documents';
import Debug from '../Pages/Debug';
import Identities from '../Pages/Identities';
import SimpleSnackbar from '../Layout/SimpleSnackbar';
import ResetPassword from '../Pages/ResetPassword';

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="main">
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path={HOME} component={Home} />
            <Route exact path={SIGN_IN} component={SignIn} />
            <Route exact path={SIGN_UP} component={SignUp} />
            <Route exact path={RESET_PASSWORD} component={ResetPassword} />
            <Route exact path={DOCUMENTS} component={Documents} />
            <Route exact path={IDENTITIES} component={Identities} />
            <Route exact path={DEBUG} component={Debug} />
          </Switch>
        </div>
        <SimpleSnackbar />
        <Footer />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;
