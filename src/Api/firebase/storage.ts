/* eslint-disable import/no-cycle */
import { storage } from './firebase';
import { createFingerprint, destroyContainer, buildContainer } from '../wca';
import { MIME_TYPES } from './constants';

// keep
const uploadBlob = (
  reference: firebase.storage.Reference, data: Blob, metadata?: firebase.storage.UploadMetadata,
): Promise<string> => reference.put(data, metadata)
  .then((uploadTask) => uploadTask.ref.fullPath);

// keep
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

// keep
export const removeKey = (
  fullPath: string,
): Promise<void> => storage.child(fullPath).delete();

// keep
const downloadText = (
  reference: firebase.storage.Reference,
): Promise<string> => reference
  .getDownloadURL()
  .then((url) => fetch(url))
  .then((response) => response.text());

// keep
const downloadBlob = (
  reference: firebase.storage.Reference,
): Promise<Blob> => reference
  .getDownloadURL()
  .then((url) => fetch(url))
  .then((response) => response.blob());

// keep
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

// keep
export const downloadDocument = (
  path: string,
): Promise<Blob> => downloadBlob(storage.child(path))
  .then((blob) => destroyContainer(blob));

// keep
export const uploadDocument = (
  path: string, file: File,
): Promise<string> => buildContainer(file)
  .then((encryptedFile) => uploadBlob(
    storage.child(path), encryptedFile, {
      contentType: file.type,
      customMetadata: { lastModified: file.lastModified.toString() },
    },
  ));


// keep
export const deleteDocument = (
  path: string,
): Promise<void> => storage.child(path).delete();
