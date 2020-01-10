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
import { storage } from './firebase';
import { getKeyStorage } from '../localforage';
import { createFingerprint } from '../wca';
import { MIME_TYPES } from './constants';

// keep
const uploadDocument = (
  path: string, data: Blob, metadata?: firebase.storage.UploadMetadata,
): Promise<string> => storage
  .child(path)
  .put(data, metadata)
  .then((uploadTask) => uploadTask.ref.fullPath);

// keep
export const saveKey = async (
  fullPath: string, key: string,
): Promise<string> => Promise
  .resolve(createFingerprint(key))
  .then((fingerprint) => {
    const keyBlob = new Blob([key], { type: MIME_TYPES.X_PEM_FILE });
    return uploadDocument(fullPath, keyBlob, {
      contentType: MIME_TYPES.X_PEM_FILE,
      customMetadata: { fingerprint },
    });
  });

// keep
export const removeKey = (
  fullPath: string,
): Promise<void> => storage.child(fullPath).delete();

// keep
const downloadDocument = (
  reference: firebase.storage.Reference,
): Promise<string> => reference
  .getDownloadURL()
  .then((url) => fetch(url))
  .then((response) => response.text());

// keep
export const downloadKey = async (
  fullPath: string,
): Promise<string> => {
  const reference = storage.child(fullPath);
  const key = await downloadDocument(reference);
  const fingerprint = await reference
    .getMetadata()
    .then((metadata) => metadata.customMetadata.fingerprint);
  const calculatedFingerprint = await createFingerprint(key);
  if (fingerprint !== calculatedFingerprint) {
    throw new Error(`Fingerprints of donwload file ${fullPath} does not match.`);
  }
  return key;
};


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
      // .then((arrayBuffer) => encryptDataWithAES(arrayBuffer))
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
};

export const shareRSAPublicKeys = async (
  userID: string,
): Promise<void> => {
  const keys = await getKeyStorage();
  await shareRSAPublicKey(userID, 'rsaOAEP.pem', keys.rsaOAEP.publicKey, keys.rsaOAEP.publicKeyFingerprint);
  await shareRSAPublicKey(userID, 'rsaPSS.pem', keys.rsaPSS.publicKey, keys.rsaPSS.publicKeyFingerprint);
};

// export const downloadDocument = (
//   userID: string, filename: string,
// ): void => {
//   const ref = storage.child(`documents/${userID}/${filename}`);
//   ref
//     .getDownloadURL()
//     .then((url) => fetch(url))
//     .then((response) => response.arrayBuffer())
//     .then((arrayBuffer) => decryptDataWithAES(arrayBuffer))
//     .then((decrypted) => new Blob([decrypted]))
//     .then((blob) => saveData(blob, filename));
// };

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
      dispatch(saveDocuments(result));
      dispatch(clearUILoading());
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const exchangeKey = (
  userID: string, exchangeUserID: string, url: string,
) => async (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction>,
): Promise<void> => {
  dispatch(setUILoading());
  const ref = storage.child(`exchange/${exchangeUserID}/${userID}/aesCBC.json`);
};

export const deleteExchangeKey = (
  userID: string, exchangeUserID: string,
) => async (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction>,
): Promise<void> => {
  dispatch(setUILoading());
  const ref = storage.child(`exchange/${exchangeUserID}/${userID}/aesCBC.json`);
  ref.delete()
    .then(() => {
      dispatch(openSnackbar('You\'ve successfully deleted the exchanged key.'));
      dispatch(clearUILoading());
    })
    .catch(() => {
      dispatch(openSnackbar('You\'ve already deleted the exchanged key.'));
      dispatch(clearUILoading());
    });
};
