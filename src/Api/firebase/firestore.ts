/* eslint-disable import/no-cycle */
import firebase from 'firebase/app';
import {
  storeDocument, StoreDocumentAction,
} from 'src/Store/documents/DocumentActions';
import { Dispatch } from 'react';
import { KeyInfo } from 'src/Models/KeyInfo';
import { firestore, storage } from './firebase';
import {
  RSA_OAEP_PEM, RSA_PSS_PEM, PKI, USERS, USER_KEY_PEM, DOCUMENTS, DOCUMENTS_DATA, EXCHANGE,
} from './constants';
import {
  saveKey, removeKey, uploadDocument, deleteDocument, uploadBlob, downloadKey, downloadBlob,
} from './storage';
import {
  encryptWithDataNameKey, decryptWithDataNameKey, createHash, addSharingToContainer,
  importRSAOAEPPublicKey,
  revokeSharingToContainer,
} from '../wca';
import currentHost from '../host';

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

export const listAllKeysFromPKI = (
): Promise<string[]> => firestore.collection(PKI).get()
  .then((querySnapshot) => querySnapshot.docs.map((doc) => doc.id));

export const removeKeysFromPKI = (
  userID: string,
): Promise<void> => removeKey(RSA_OAEP_PEM(userID))
  .then(() => removeKey(RSA_PSS_PEM(userID)))
  .then(() => firestore.collection(PKI).doc(userID).delete());

export const getRSAOAEPPublicKey = (
  userID: string,
): Promise<string> => firestore.collection(PKI).doc(userID).get()
  .then((doc) => doc.get('rsaOAEP'));

export const getRSAPSSPublicKey = (
  userID: string,
): Promise<string> => firestore.collection(PKI).doc(userID).get()
  .then((doc) => doc.get('rsaPSS'));

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

export const removeKeyInfo = (
  userID: string,
): Promise<void> => removeKey(USER_KEY_PEM(userID, 'rsaOAEP'))
  .then(() => removeKey(USER_KEY_PEM(userID, 'rsaPSS')))
  .then(() => removeKey(USER_KEY_PEM(userID, 'dataNameKey')))
  .then(() => firestore.collection(USERS).doc(userID).delete());

export const getIVDataNameKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('dataNameKey.iv'));

export const getDataNameKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('dataNameKey.key'));

export const getSaltPasswordKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('passwordKey.salt'));

export const getIVRSAOAEP = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('rsaOAEP.iv'));

export const getRSAOAEPPrivateKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('rsaOAEP.privateKey'));

export const getIVRSAPSS = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('rsaPSS.iv'));

export const getRSAPSSPrivateKey = (
  userID: string,
): Promise<string> => firestore.collection(USERS).doc(userID).get()
  .then((doc) => doc.get('rsaPSS.privateKey'));


export const removeExistingDocuments = (
  userID: string,
): Promise<void> => firestore
  .collection(USERS).doc(userID).get()
  .then((doc) => doc.get('documents'))
  .then((documents) => documents
    .forEach(async (documentID: string) => { // every documentID
      await firestore.collection(DOCUMENTS).doc(documentID).get()
        .then((doc) => doc.get('path'))
        .then((path: string) => deleteDocument(path));
      await firestore.collection(DOCUMENTS).doc(documentID).delete();
      await firestore.collection(EXCHANGE).get()
        .then((query) => query.docs) // every exchange hash for every documentID
        .then((exchanges) => exchanges
          .filter(async (hash) => {
            const currentDocumentID = await firestore.collection(EXCHANGE).doc(hash.id).get()
              .then((doc) => doc.get('documentID'));
            return documentID === currentDocumentID;
          }) // every exchange hash for every documentID that belongs to user with the given userID
          .forEach((hash) => firestore.collection(EXCHANGE).doc(hash.id).delete()));
    }));

export const uploadDocumentReferences = async (
  userID: string, files: FileList,
): Promise<void> => {
  for (let index = 0; index < files.length; index = +1) {
    const file = files[index];
    encryptWithDataNameKey(file.name)
      .then((filename) => uploadDocument(DOCUMENTS_DATA(filename), file))
      .then(async (path) => {
        const filename = await encryptWithDataNameKey(file.name);
        return firestore.collection(DOCUMENTS).add({
          filename,
          path,
          shared: false,
        });
      })
      .then((reference) => reference.id)
      .then((documentID) => firestore.collection(USERS).doc(userID)
        .update({
          documents: firebase.firestore.FieldValue.arrayUnion(documentID),
        }));
  }
};

export const addSharedDocumentReference = (
  userID: string, documentID: string,
): Promise<void> => firestore
  .collection(USERS)
  .doc(userID)
  .update({
    documents: firebase.firestore.FieldValue.arrayUnion(documentID),
  });

export const deleteDocumentReference = (
  id: string, path: string,
): Promise<void> => firestore
  .collection(USERS).get()
  .then((users) => users.forEach((user) => user.ref.update({
    documents: firebase.firestore.FieldValue.arrayRemove(id),
  })))
  .then(() => firestore.collection(DOCUMENTS).doc(id).delete())
  .then(() => deleteDocument(path));

export const listDocumentReferences = (
  userID: string,
) => async (
  dispatch: Dispatch<StoreDocumentAction>,
): Promise<void> => firestore
  .collection(USERS).doc(userID).get()
  .then((doc) => doc.get('documents'))
  .then((documents) => {
    if (documents !== undefined) {
      documents.map((document: string) => firestore
        .collection(DOCUMENTS).doc(document).get()
        .then(async (doc) => {
          const filename = await decryptWithDataNameKey(doc.get('filename'));
          dispatch(
            storeDocument(document, filename, doc.get('path'), doc.get('shared')),
          );
        }));
    }
  });


export const getFileExtension = (
  type: string,
): string => type.substring(type.indexOf('/') + 1);

export const addExchangeHolder = (
  userID: string, documentID: string,
): Promise<string> => firestore.collection(DOCUMENTS).doc(documentID).update({ shared: true })
  .then(() => firestore.collection(DOCUMENTS).doc(documentID).get())
  .then((doc) => doc.get('path'))
  .then(async (path) => {
    const ref = storage.child(path);
    const blob = await downloadBlob(ref);
    const contentType = await ref.getMetadata()
      .then((metadata) => metadata.contentType);
    const fileExtension = getFileExtension(contentType);
    const cryptoKey = await getRSAOAEPPublicKey(userID)
      .then((publicKeyPath) => downloadKey(publicKeyPath))
      .then((key) => importRSAOAEPPublicKey(key));
    const hash = await createHash(path);
    const newBlob = await addSharingToContainer(blob, userID, cryptoKey);
    await uploadBlob(ref, newBlob, { contentType });
    await firestore.collection(EXCHANGE).doc(hash).set({ documentID });
    return `${currentHost}/${DOCUMENTS}/${hash}.${fileExtension}`;
  });

export const revokeExchangeHolder = (
  userID: string, documentID: string,
): Promise<void> => firestore.collection(DOCUMENTS).doc(documentID).update({ shared: false })
  .then(() => firestore.collection(DOCUMENTS).doc(documentID).get())
  .then((doc) => doc.get('path'))
  .then((path) => createHash(path))
  .then((hash) => firestore.collection(EXCHANGE).doc(hash))
  .then((doc) => doc.delete())
  .then(() => firestore.collection(DOCUMENTS).doc(documentID).get())
  .then((doc) => doc.get('path'))
  .then(async (path) => {
    const ref = storage.child(path);
    const blob = await downloadBlob(ref);
    const contentType = await ref.getMetadata()
      .then((metadata) => metadata.contentType);
    const newBlob = await revokeSharingToContainer(blob, userID);
    uploadBlob(ref, newBlob, { contentType });
  });

export const getDocumentPathFromHash = (
  hash: string,
): Promise<string> => Promise
  .resolve(hash.substring(0, hash.indexOf('.')))
  .then((path) => firestore.collection(EXCHANGE).doc(path).get())
  .then((doc) => doc.get('documentID'))
  .then((documentID) => firestore.collection(DOCUMENTS).doc(documentID).get())
  .then((doc) => doc.get('path'));
