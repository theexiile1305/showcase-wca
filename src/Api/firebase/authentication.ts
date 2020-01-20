
import { Dispatch } from 'react';
import {
  logoutUser, LogoutUserAction, StoreUserAction, storeUser,
} from 'src/Store/user/UserActions';
import {
  setUILoading, clearUILoading, openSnackbar,
  SetUILoadingAction, SetUIStopLoadingAction, OpenSnackbarAction,
} from 'src/Store/ui/UIActions';
import {
  saveAESCBC, SaveAESCBCAction, removeDebug, RemoveDebugAction,
} from 'src/Store/debug/DebugActions';
import { store } from 'src/Store';
import { removeDocuments, RemoveDocumentsAction } from 'src/Store/documents/DocumentActions';
import { removePKI, RemovePKIAction } from 'src/Store/pki/PKIActions';
import { removeCryptoKeys, saveCryptoKeys } from '../localforage';
import { getSaltPasswordHash } from './constants';
import { downloadKey } from './storage';
import { auth } from './firebase';
import {
  derivePasswordHash, derivePasswordKey, importDataNameKey,
  importRSAPSSPublicKey, importRSAOAEPPublicKey, importRSAPSSPrivateKey,
  importRSAOAEPPrivateKey, setupKeys, newIV,
} from '../wca';
import {
  getIVDataNameKey, getDataNameKey, getSaltPasswordKey, getRSAOAEPPrivateKey,
  getRSAOAEPPublicKey, getIVRSAOAEP, getIVRSAPSS, getRSAPSSPrivateKey,
  getRSAPSSPublicKey, removeKeysFromPKI, removeKeyInfo, removeExistingDocuments,
} from './firestore';

const getPasswordHash = (
  password: string,
): Promise<string> => derivePasswordHash(password, getSaltPasswordHash());

export const isAuthenticated = (
): boolean => store.getState().user.uid != null;

export const verifyAuth = (
): void => {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      auth.signOut();
    }
  });
};

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
      await setupKeys(password, user);
      await auth.signOut();
      dispatch(openSnackbar('Please verify your e-mail address in order to sign in.'));
    })
    .catch((error) => dispatch(openSnackbar(error.message)))
    .finally(() => {
      dispatch(clearUILoading());
      redirect();
    });
};

export const signInWithEmailPassword = (
  email: string, password: string, redirect: () => void,
) => async (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | StoreUserAction | SaveAESCBCAction>,
): Promise<void> => Promise
  .resolve(dispatch(setUILoading()))
  .then(() => getSaltPasswordHash())
  .then((saltPasswordHash) => derivePasswordHash(password, saltPasswordHash))
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
    const saltPasswordHash = getSaltPasswordHash();
    const saltPasswordKey = await getSaltPasswordKey(userID);
    const passwordKey = await derivePasswordKey(password, saltPasswordKey);
    const ivRSAOAEP = await getIVRSAOAEP(userID);
    const rsaOAEPPrivate = await getRSAOAEPPrivateKey(userID)
      .then((rsaOAEPPrivateKey) => downloadKey(rsaOAEPPrivateKey))
      .then((rsaOAEPPrivateKey) => importRSAOAEPPrivateKey(
        rsaOAEPPrivateKey, passwordKey, ivRSAOAEP,
      ));
    const rsaOAEPPublic = await getRSAOAEPPublicKey(userID)
      .then((rsaOAEPPublicKey) => downloadKey(rsaOAEPPublicKey))
      .then((rsaOAEPPublicKey) => importRSAOAEPPublicKey(rsaOAEPPublicKey));
    const ivRSAPSS = await getIVRSAPSS(userID);
    const rsaPSSPrivate = await getRSAPSSPrivateKey(userID)
      .then((rsaPSSPrivateKey) => downloadKey(rsaPSSPrivateKey))
      .then((rsaPSSPrivateKey) => importRSAPSSPrivateKey(rsaPSSPrivateKey, passwordKey, ivRSAPSS));
    const rsaPSSPublic = await getRSAPSSPublicKey(userID)
      .then((rsaPSSPublicKey) => downloadKey(rsaPSSPublicKey))
      .then((rsaPSSPublicKey) => importRSAPSSPublicKey(rsaPSSPublicKey));
    const ivDataNameKey = await getIVDataNameKey(userID);
    const dataNameKey = await getDataNameKey(userID)
      .then((key) => downloadKey(key))
      .then((key) => importDataNameKey(key, rsaOAEPPrivate));
    dispatch(saveAESCBC(await newIV()));
    await saveCryptoKeys({
      saltPasswordHash,
      passwordKey: {
        salt: saltPasswordKey,
        key: passwordKey,
      },
      rsaOAEP: {
        iv: ivRSAOAEP,
        privateKey: rsaOAEPPrivate,
        publicKey: rsaOAEPPublic,
      },
      rsaPSS: {
        iv: ivRSAPSS,
        privateKey: rsaPSSPrivate,
        publicKey: rsaPSSPublic,
      },
      dataNameKey: {
        iv: ivDataNameKey,
        key: dataNameKey,
      },
    });
  })
  .then(() => dispatch(openSnackbar('You´ve been successfully signed in.')))
  .catch((error) => dispatch(openSnackbar(error.message)))
  .finally(() => {
    dispatch(clearUILoading());
    redirect();
  });

export const signOut = (
  redirect: () => void,
) => (
  dispatch: Dispatch<SetUILoadingAction | RemoveDocumentsAction | RemoveDebugAction
  | RemovePKIAction | OpenSnackbarAction | LogoutUserAction | SetUIStopLoadingAction>,
): void => {
  dispatch(setUILoading());
  auth.signOut()
    .then(() => removeCryptoKeys())
    .then(() => dispatch(removeDocuments()))
    .then(() => dispatch(removeDebug()))
    .then(() => dispatch(removePKI()))
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
        await removeExistingDocuments(user.uid);
        await removeKeyInfo(user.uid);
        await removeCryptoKeys();
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
