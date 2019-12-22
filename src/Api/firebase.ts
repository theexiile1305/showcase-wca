import firebase from 'firebase/app';
import 'firebase/auth';

import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

export default firebase;
