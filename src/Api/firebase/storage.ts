import { Dispatch } from 'redux';
import {
  SetUILoadingAction, SetUIStopLoadingAction, OpenSnackbarAction,
  setUILoading, clearUILoading, openSnackbar,
} from 'src/Store/ui/UIActions';
import {
  saveDocuments, SaveDocumentAction, removeDocument, RemoveDocumentAction,
} from 'src/Store/documents/DocumentActions';
import saveData from '../saveData';
import { decryptDataWithAES, encryptDataWithAES } from '../wca';
import { storage } from './firebase';

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
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction>,
): Promise<void> => {
  dispatch(setUILoading());
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const { name, type, lastModified } = file;
    const ref = storage.child(`${userID}/documents/${name}`);
    blobToArrayBuffer(file)
      .then((arrayBuffer) => encryptDataWithAES(arrayBuffer))
      .then((arrayBuffer) => new Blob([arrayBuffer], { type }))
      .then((blob) => ref
        .put(blob, {
          contentType: type,
          customMetadata: { lastModified: lastModified.toString() },
        })
        .on('state_changed', null, () => {
          dispatch(openSnackbar('You\'ve unsuccessfully uploaded the file(s).'));
          dispatch(clearUILoading());
        }, () => {
          dispatch(openSnackbar('You\'ve successfully uploaded the file(s).'));
          dispatch(clearUILoading());
        }));
  }
};

export const downloadDocument = (
  userID: string, filename: string,
): void => {
  const ref = storage.child(`${userID}/documents/${filename}`);
  ref
    .getDownloadURL()
    .then((url) => fetch(url))
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => decryptDataWithAES(arrayBuffer))
    .then((decrypted) => new Blob([decrypted]))
    .then((blob) => saveData(blob, filename));
};

export const deleteDocument = (
  userID: string, filename: string,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | RemoveDocumentAction>,
): void => {
  dispatch(setUILoading());
  const ref = storage.child(`${userID}/documents/${filename}`);
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

export const listAllDocuments = (
  userID: string,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | SaveDocumentAction>,
): void => {
  dispatch(setUILoading());
  const ref = storage.child(`${userID}/documents/`);
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
