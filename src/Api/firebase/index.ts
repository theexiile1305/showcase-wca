/* eslint-disable import/no-duplicates */
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/storage';

import config from './config';

firebase.initializeApp(config);

export default firebase;
