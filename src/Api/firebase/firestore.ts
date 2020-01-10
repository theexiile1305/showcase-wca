/* eslint-disable import/no-cycle */
import { KeyInfo } from 'src/Models/firestore/KeyInfo';
import { firestore } from './firebase';
import {
  RSA_OAEP_PEM, RSA_PSS_PEM, PKI, USERS, USER_KEY_PEM,
} from './constants';
import { saveKey, removeKey } from './storage';

// keep
export const saveKeysToPKI = async (
  userID: string, rsaOAEP: string, rsaPSS: string,
): Promise<void> => {
  const rsaOAEPFullPath = await saveKey(RSA_OAEP_PEM(userID), rsaOAEP);
  const rsaPSSFullPath = await saveKey(RSA_PSS_PEM(userID), rsaPSS);
  firestore.collection(PKI).doc(userID).set({
    rsaOAEP: rsaOAEPFullPath,
    rsaPSS: rsaPSSFullPath,
  });
};

export const determineEmail = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('email'));

// keep
export const listAllKeysFromPKI = (
): Promise<string[]> => firestore.collection(PKI).get()
  .then((querySnapshot) => querySnapshot.docs.map((doc) => doc.id));

// keep
export const removeKeysFromPKI = (
  userID: string,
): Promise<void> => removeKey(RSA_OAEP_PEM(userID))
  .then(() => removeKey(RSA_PSS_PEM(userID)))
  .then(() => firestore.collection(PKI).doc(userID).delete());

// keep
export const getRSAOAEPPublicKey = (
  userID: string,
): Promise<string> => firestore.collection(PKI).doc(userID).get()
  .then((doc) => doc.get('rsaOAEP'));

// keep
export const getRSAPSSPublicKey = (
  userID: string,
): Promise<string> => firestore.collection(PKI).doc(userID).get()
  .then((doc) => doc.get('rsaPSS'));

// keep
export const saveKeyInfo = async (
  user: firebase.User, keyInfo: KeyInfo,
): Promise<void> => {
  const { uid, email } = user;
  const rsaOAEPFullPath = await saveKey(USER_KEY_PEM(uid, 'rsaOAEP'), keyInfo.rsaOAEP.privateKey);
  const rsaPSSFullPath = await saveKey(USER_KEY_PEM(uid, 'rsaPSS'), keyInfo.rsaPSS.privateKey);
  const dataNameKeyFullPath = await saveKey(USER_KEY_PEM(uid, 'dataNameKey'), keyInfo.dataNameKey.key);
  firestore.collection(USERS).doc(uid).set({
    email,
    passwordKey: {
      salt: keyInfo.passwordKey.salt,
    },
    rsaOAEP: {
      iv: keyInfo.rsaOAEP.iv,
      privateKey: rsaOAEPFullPath,
    },
    rsaPSS: {
      iv: keyInfo.rsaPSS.iv,
      privateKey: rsaPSSFullPath,
    },
    dataNameKey: {
      iv: keyInfo.dataNameKey.iv,
      key: dataNameKeyFullPath,
    },
  });
};

// keep
export const removeKeyInfo = (
  userID: string,
): Promise<void> => removeKey(USER_KEY_PEM(userID, 'rsaOAEP'))
  .then(() => removeKey(USER_KEY_PEM(userID, 'rsaPSS')))
  .then(() => removeKey(USER_KEY_PEM(userID, 'dataNameKey')))
  .then(() => firestore.collection(USERS).doc(userID).delete());

// keep
export const getIVDataNameKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('dataNameKey.iv'));

// keep
export const getDataNameKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('dataNameKey.key'));

// keep
export const getSaltPasswordKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('passwordKey.salt'));

// keep
export const getIVRSAOAEP = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('rsaOAEP.iv'));

// keep
export const getRSAOAEPPrivateKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('rsaOAEP.privateKey'));

// keep
export const getIVRSAPSS = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('rsaPSS.iv'));

// keep
export const getRSAPSSPrivateKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('rsaPSS.privateKey'));
