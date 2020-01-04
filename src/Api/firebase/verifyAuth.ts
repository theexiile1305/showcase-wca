import store from 'src/Store';
import { saveUserData } from 'src/Store/user/UserActions';
import { auth } from './firebase';

const verifyAuth = (): void => {
  auth.onAuthStateChanged((user) => store.dispatch(saveUserData(user)));
};

export default verifyAuth;
