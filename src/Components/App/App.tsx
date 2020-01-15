import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import 'src/Assets/App.css';
import { Provider } from 'react-redux';
import {
  HOME, SIGN_IN, SIGN_UP, DOCUMENTS, IDENTITIES, DEBUG, USER,
} from 'src/Routes';
import AuthRoute from 'src/Routes/AuthRoute';
import { verifyAuth } from 'src/Api/firebase/authentication';
import { store, persistor } from 'src/Store';
import { PersistGate } from 'redux-persist/integration/react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import Home from '../Pages/Home';
import SignUp from '../Pages/SignUp';
import SignIn from '../Pages/SignIn';
import Documents from '../Pages/Documents';
import Debug from '../Pages/Debug';
import Identities from '../Pages/Identities';
import User from '../Pages/User';
import SimpleSnackbar from '../Layout/SimpleSnackbar';
import NotFound from '../Pages/error/NotFound';
import Exchange from '../Pages/Exchange';

const App: React.FC = () => {
  verifyAuth();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <div className="main">
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path={HOME} component={Home} />
                <Route exact path={SIGN_IN} component={SignIn} />
                <Route exact path={SIGN_UP} component={SignUp} />
                <AuthRoute exact path={DOCUMENTS} component={Documents} />
                <AuthRoute exact path={`${DOCUMENTS}/:hash`} component={Exchange} />
                <AuthRoute exact path={IDENTITIES} component={Identities} />
                <AuthRoute exact path={USER} component={User} />
                <AuthRoute exact path={DEBUG} component={Debug} />
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
            <SimpleSnackbar />
            <Footer />
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
