
import { Dispatch } from 'react';
import store from 'src/Store';
import {
  logoutUser, LogoutUserAction, StoreUserAction, storeUser,
} from 'src/Store/user/UserActions';
import {
  setUILoading, clearUILoading, openSnackbar,
  SetUILoadingAction, SetUIStopLoadingAction, OpenSnackbarAction,
} from 'src/Store/ui/UIActions';
import {
  storeSaltPasswordHash, StoreSaltPasswordHashAction,
  storePasswordKey, StorePasswordKeyAction,
  storeRSAOAEP, StoreRSAOAEPAction,
  storeRSAPSS, StoreRSAPSSAction,
  storeDataNameKey, StoreDataNameKeyAction,
  removeCryptoKeys, RemoveCryptoKeysAction,
} from 'src/Store/crypto/CryptoActions';
import { saveAESCBC, SaveAESCBCAction } from 'src/Store/debug/DebugActions';
import { getSaltPasswordHash } from './constants';
import { downloadKey } from './storage';
import { auth } from './firebase';
import {
  derivePasswordHash, derivePasswordKey, importDataNameKey,
  importRSAPSSPublicKey, importRSAOAEPPublicKey, importRSAPSSPrivateKey,
  importRSAOAEPPrivateKey, changePasswordHash, setupKeys, newIV,
} from '../wca';
import {
  getIVDataNameKey, getDataNameKey, getSaltPasswordKey, getRSAOAEPPrivateKey,
  getRSAOAEPPublicKey, getIVRSAOAEP, getIVRSAPSS, getRSAPSSPrivateKey,
  getRSAPSSPublicKey, removeKeysFromPKI, removeKeyInfo,
} from './firestore';

// keep
const getPasswordHash = (
  password: string,
): Promise<string> => {
  const { saltPasswordHash } = store.getState().crypto;
  if (!saltPasswordHash) {
    return derivePasswordHash(password, getSaltPasswordHash());
  }
  return derivePasswordHash(password, saltPasswordHash);
};

// keep
export const isAuthenticated = (): boolean => auth.currentUser != null;

// keep
export const signUp = (
  displayName: string, email: string, password: string, redirect: () => void,
) => async (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | LogoutUserAction>,
): Promise<void> => {
  dispatch(setUILoading());
  getPasswordHash(password)
    .then((passwordHash) => auth.createUserWithEmailAndPassword(email, passwordHash))
    .then(async (userCredential) => {
      const { user } = userCredential;
      if (!user) {
        throw new Error('Please try your registration again.');
      }
      return user;
    })
    .then(async (user) => {
      await user.updateProfile({ displayName });
      await user.sendEmailVerification();
      await setupKeys(password, user.uid);
      await auth.signOut();
      dispatch(openSnackbar('Please verify your e-mail address in order to sign in.'));
    })
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => {
      dispatch(clearUILoading());
      redirect();
    });
};

// keep
export const signInWithEmailPassword = (
  email: string, password: string, redirect: () => void,
) => async (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | StoreUserAction | StoreSaltPasswordHashAction | StorePasswordKeyAction | StoreRSAOAEPAction
  | StoreRSAPSSAction | StoreDataNameKeyAction | SaveAESCBCAction>,
): Promise<void> => Promise
  .resolve(dispatch(setUILoading()))
  .then(() => getSaltPasswordHash())
  .then((saltPasswordHash) => {
    dispatch(storeSaltPasswordHash(saltPasswordHash));
    return derivePasswordHash(password, saltPasswordHash);
  })
  .then((passwordHash) => auth.signInWithEmailAndPassword(email, passwordHash))
  .then(async (userCredential) => {
    const { user } = userCredential;
    if (!user || !user.emailVerified || !user.email) {
      await auth.signOut();
      throw new Error('Please verify your e-mail adress in order to sign in.');
    }
    dispatch(storeUser(user));
    return user.uid;
  })
  .then(async (userID) => {
    const saltPasswordKey = await getSaltPasswordKey(userID);
    const passwordKey = await derivePasswordKey(password, saltPasswordKey);
    dispatch(storePasswordKey(saltPasswordKey, passwordKey));

    const ivRSAOAEP = await getIVRSAOAEP(userID);
    const rsaOAEPPrivate = await getRSAOAEPPrivateKey(userID)
      .then((rsaOAEPPrivateKey) => downloadKey(rsaOAEPPrivateKey))
      .then((rsaOAEPPrivateKey) => importRSAOAEPPrivateKey(rsaOAEPPrivateKey, passwordKey, ivRSAOAEP));
    const rsaOAEPPublic = await getRSAOAEPPublicKey(userID)
      .then((rsaOAEPPublicKey) => downloadKey(rsaOAEPPublicKey))
      .then((rsaOAEPPublicKey) => importRSAOAEPPublicKey(rsaOAEPPublicKey));
    dispatch(storeRSAOAEP(ivRSAOAEP, rsaOAEPPrivate, rsaOAEPPublic));

    const ivRSAPSS = await getIVRSAPSS(userID);
    const rsaPSSPrivate = await getRSAPSSPrivateKey(userID)
      .then((rsaPSSPrivateKey) => downloadKey(rsaPSSPrivateKey))
      .then((rsaPSSPrivateKey) => importRSAPSSPrivateKey(rsaPSSPrivateKey, passwordKey, ivRSAPSS));
    const rsaPSSPublic = await getRSAPSSPublicKey(userID)
      .then((rsaPSSPublicKey) => downloadKey(rsaPSSPublicKey))
      .then((rsaPSSPublicKey) => importRSAPSSPublicKey(rsaPSSPublicKey));
    dispatch(storeRSAPSS(ivRSAPSS, rsaPSSPrivate, rsaPSSPublic));

    const ivDataNameKey = await getIVDataNameKey(userID);
    const dataNameKey = await getDataNameKey(userID)
      .then((key) => downloadKey(key))
      .then((key) => importDataNameKey(key, rsaOAEPPrivate));
    dispatch(storeDataNameKey(ivDataNameKey, dataNameKey));

    dispatch(saveAESCBC(await newIV()));
  })
  .then(() => dispatch(openSnackbar('You´ve been successfully signed in.')))
  .catch((error) => dispatch(openSnackbar(error.message)))
  .finally(() => {
    dispatch(clearUILoading());
    redirect();
  });

// keep
export const signOut = (
  redirect: () => void,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | LogoutUserAction | RemoveCryptoKeysAction>,
): void => {
  dispatch(setUILoading());
  auth.signOut()
    .then(() => dispatch(removeCryptoKeys()))
    .then(() => {
      dispatch(openSnackbar('You´ve been successfully signed out.'));
      dispatch(logoutUser());
    })
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => {
      dispatch(clearUILoading());
      redirect();
    });
};

// keep
export const changeDisplayName = (
  password: string, displayName: string,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | StoreUserAction>,
): void => {
  dispatch(setUILoading());
  const { email } = store.getState().user;
  if (!email) {
    throw new Error('Could not change the username. Try it again!');
  }
  getPasswordHash(password)
    .then((passwordHash) => auth.signInWithEmailAndPassword(email, passwordHash))
    .then(async (userCredential) => {
      const { user } = userCredential;
      if (user != null) {
        await user.updateProfile({ displayName });
        auth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            dispatch(storeUser(currentUser));
            dispatch(openSnackbar('You´ve successfully changed your username.'));
          }
        });
      }
    })
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => dispatch(clearUILoading()));
};

// keep
export const changeEmail = (
  password: string, newEmail: string,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | StoreUserAction>,
): void => {
  dispatch(setUILoading());
  const { email } = store.getState().user;
  if (!email) {
    throw new Error('Could not change the username. Try it again!');
  }
  getPasswordHash(password)
    .then((passwordHash) => auth.signInWithEmailAndPassword(email, passwordHash))
    .then(async (userCredential) => {
      const { user } = userCredential;
      if (user != null) {
        await user.updateEmail(newEmail);
        await user.sendEmailVerification();
        auth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            dispatch(storeUser(currentUser));
            dispatch(openSnackbar('You´ve successfully changed your email.'));
          }
        });
      }
    })
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => dispatch(clearUILoading()));
};

// keep
export const changePassword = (
  password: string, newPassword: string,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | LogoutUserAction>,
): void => {
  dispatch(setUILoading());
  const { email } = store.getState().user;
  if (!email) {
    throw new Error('Could not change your password. Try it again!');
  }
  getPasswordHash(password)
    .then((passwordHash) => auth.signInWithEmailAndPassword(email, passwordHash))
    .then((userCredential) => {
      const { user } = userCredential;
      return user;
    })
    .then(async (user) => {
      if (user != null) {
        await changePasswordHash(newPassword, user.uid)
          .then(() => getPasswordHash(newPassword))
          .then((newPasswordHash) => user.updatePassword(newPasswordHash));
        dispatch(openSnackbar('You´ve successfully changed your password.'));
        dispatch(logoutUser());
      }
    })
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => dispatch(clearUILoading()));
};

// keep
export const deleteAccount = (
  password: string, redirect: () => void,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | LogoutUserAction>,
): void => {
  dispatch(setUILoading());
  const { email } = store.getState().user;
  if (!email) {
    throw new Error('Could not delete the acount. Try it again!');
  }
  getPasswordHash(password)
    .then((passwordHash) => auth.signInWithEmailAndPassword(email, passwordHash))
    .then(async (userCredential) => {
      const { user } = userCredential;
      if (user != null) {
        await removeKeysFromPKI(user.uid);
        await removeKeyInfo(user.uid);
        await user.delete();
        dispatch(openSnackbar('You´ve successfully deleted your account.'));
        dispatch(logoutUser());
      }
    })
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => {
      dispatch(clearUILoading());
      redirect();
    });
};
