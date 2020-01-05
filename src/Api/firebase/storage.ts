import { Dispatch } from 'redux';
import {
  SetUILoadingAction, SetUIStopLoadingAction, OpenSnackbarAction,
  setUILoading, clearUILoading, openSnackbar,
} from 'src/Store/ui/UIActions';
import {
  saveDocuments, SaveDocumentAction, removeDocument, RemoveDocumentAction,
  saveSingleDocument, SaveSingleDocumentAction, saveSharedPublicKeys, SaveSharedPublicKeysAction,
  removeSharedPublicKeys, RemoveSharedPublicKeysAction,
} from 'src/Store/documents/DocumentActions';
import { SharedPublicKey } from 'src/Models/SharedPublicKey';
import { SharedPublicKeys } from 'src/Models/SharedPublicKeys';
import saveData from '../saveData';
import { storage } from './firebase';
import { exportPublicCryptoKey } from '../wca/pemManagement';
import { encryptDataWithAES, decryptDataWithAES } from '../wca';
import { getKeyStorage } from '../localforage';

const blobToArrayBuffer = (
  data: Blob,
): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(data);
  reader.onerror = reject;
  reader.onload = (): void => resolve(reader.result as ArrayBuffer);
});

export const uploadDocuments = (
  userID: string, files: FileList,
) => async (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | SaveSingleDocumentAction>,
): Promise<void> => {
  dispatch(setUILoading());
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const { name, type, lastModified } = file;
    const ref = storage.child(`documents/${userID}/${name}`);
    blobToArrayBuffer(file)
      .then((arrayBuffer) => encryptDataWithAES(arrayBuffer))
      .then((arrayBuffer) => new Blob([arrayBuffer], { type }))
      .then((blob) => ref
        .put(blob, {
          contentType: type,
          customMetadata: { lastModified: lastModified.toString() },
        })
        .on('state_changed', null,
          () => dispatch(openSnackbar('You\'ve unsuccessfully uploaded the file(s).')),
          () => dispatch(openSnackbar('You\'ve successfully uploaded the file(s).'))))
      .then(() => dispatch(saveSingleDocument(name, ref.fullPath)))
      .then(() => dispatch(clearUILoading()))
      .catch((error) => {
        dispatch(openSnackbar(error.message));
        dispatch(clearUILoading());
      });
  }
};

const shareRSAPublicKey = async (
  userID: string, filename: string, publicKey: CryptoKey, fingerprint: string,
): Promise<void> => {
  const ref = storage.child(`publicKeys/${userID}/${filename}`);
  await exportPublicCryptoKey(publicKey)
    .then((pem) => new Blob([pem], { type: 'application/x-pem-file ' }))
    .then((blob) => ref
      .put(blob, {
        contentType: 'application/x-pem-file ',
        customMetadata: { fingerprint },
      }));
};

export const shareRSAPublicKeys = async (
  userID: string,
): Promise<void> => {
  const keys = await getKeyStorage();
  await shareRSAPublicKey(userID, 'rsaOAEP.pem', keys.rsaOAEP.publicKey, keys.rsaOAEP.publicKeyFingerprint);
  await shareRSAPublicKey(userID, 'rsaPSS.pem', keys.rsaPSS.publicKey, keys.rsaPSS.publicKeyFingerprint);
};

export const downloadDocument = (
  userID: string, filename: string,
): void => {
  const ref = storage.child(`documents/${userID}/${filename}`);
  ref
    .getDownloadURL()
    .then((url) => fetch(url))
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => decryptDataWithAES(arrayBuffer))
    .then((decrypted) => new Blob([decrypted]))
    .then((blob) => saveData(blob, filename));
};

export const deleteSharedPublicKeys = (
  userID: string,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | RemoveSharedPublicKeysAction>,
): void => {
  dispatch(setUILoading());
  const ref = storage.child(`publicKey/${userID}/`);
  ref.delete()
    .then(() => dispatch(removeSharedPublicKeys(userID)))
    .then(() => dispatch(clearUILoading()));
};

export const deleteDocument = (
  userID: string, filename: string,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | RemoveDocumentAction>,
): void => {
  dispatch(setUILoading());
  const ref = storage.child(`documents/${userID}/${filename}`);
  ref.delete()
    .then(() => {
      dispatch(removeDocument(filename));
      dispatch(openSnackbar('You\'ve unsuccessfully deleted the file.'));
      dispatch(clearUILoading());
    })
    .catch(() => {
      dispatch(openSnackbar('You\'ve successfully deleted the file.'));
      dispatch(clearUILoading());
    });
};

const getSharedPublicKey = async (
  reference: firebase.storage.Reference, type: string,
): Promise<SharedPublicKey> => {
  const key = reference.child(type);
  const downloadURL: string = await key.getDownloadURL();
  const fingerprint: string = await key
    .getMetadata()
    .then((metadata) => metadata.customMetadata.fingerprint);
  const sharedSinglePublicKey = { downloadURL, fingerprint };
  return Promise.resolve(sharedSinglePublicKey);
};

const getSharedPublicKeys = async (
  folder: firebase.storage.Reference,
): Promise<SharedPublicKeys> => {
  const result = await Promise.all([
    getSharedPublicKey(folder, 'rsaOAEP.pem'),
    getSharedPublicKey(folder, 'rsaPSS.pem'),
  ]);
  const sharedSinglePublicKeys = {
    userID: folder.name,
    rsaOAEP: result[0],
    rsaPSS: result[1],
  };
  return sharedSinglePublicKeys;
};

export const listSharedPublicKeys = (
) => async (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | SaveSharedPublicKeysAction>,
): Promise<void> => {
  dispatch(setUILoading());
  const ref = storage.child('publicKeys/');
  ref.listAll()
    .then((result) => result.prefixes.map(
      async (folder) => dispatch(saveSharedPublicKeys(await getSharedPublicKeys(folder))),
    ))
    .then(() => dispatch(clearUILoading()))
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const listAllDocuments = (
  userID: string,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | SaveDocumentAction>,
): void => {
  dispatch(setUILoading());
  const ref = storage.child(`documents/${userID}/`);
  ref.listAll()
    .then((result) => {
      console.log(result);
      dispatch(saveDocuments(result));
      dispatch(clearUILoading());
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};
