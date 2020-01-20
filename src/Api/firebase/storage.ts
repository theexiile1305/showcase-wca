/* eslint-disable import/no-cycle */
import { storage } from './firebase';
import { createFingerprint, buildContainer, destroyContainer } from '../wca';
import { MIME_TYPES } from './constants';

export const uploadBlob = (
  reference: firebase.storage.Reference, data: Blob, metadata?: firebase.storage.UploadMetadata,
): Promise<string> => reference.put(data, metadata)
  .then((uploadTask) => uploadTask.ref.fullPath);

export const saveKey = async (
  fullPath: string, key: string,
): Promise<string> => Promise
  .resolve(createFingerprint(key))
  .then((fingerprint) => {
    const keyBlob = new Blob([key], { type: MIME_TYPES.X_PEM_FILE });
    return uploadBlob(storage.child(fullPath), keyBlob, {
      contentType: MIME_TYPES.X_PEM_FILE,
      customMetadata: { fingerprint },
    });
  });

export const removeKey = (
  fullPath: string,
): Promise<void> => storage.child(fullPath).delete();

const downloadText = (
  reference: firebase.storage.Reference,
): Promise<string> => reference
  .getDownloadURL()
  .then((url) => fetch(url))
  .then((response) => response.text());

export const downloadBlob = (
  reference: firebase.storage.Reference,
): Promise<Blob> => reference
  .getDownloadURL()
  .then((url) => fetch(url))
  .then((response) => response.blob());

export const downloadKey = async (
  fullPath: string,
): Promise<string> => {
  const reference = storage.child(fullPath);
  const key = await downloadText(reference);
  const fingerprint = await reference
    .getMetadata()
    .then((metadata) => metadata.customMetadata.fingerprint);
  const calculatedFingerprint = await createFingerprint(key);
  if (fingerprint !== calculatedFingerprint) {
    throw new Error(`Fingerprints of donwload file ${fullPath} does not match.`);
  }
  return key;
};

export const downloadDocument = (
  path: string,
): Promise<Blob> => downloadBlob(storage.child(path))
  .then((blob) => destroyContainer(blob));

export const uploadDocument = (
  path: string, file: File,
): Promise<string> => buildContainer(file)
  .then((encryptedFile) => uploadBlob(
    storage.child(path), encryptedFile, {
      contentType: file.type,
      customMetadata: { lastModified: file.lastModified.toString() },
    },
  ));


export const deleteDocument = (
  path: string,
): Promise<void> => storage.child(path).delete();
