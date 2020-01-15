/* eslint-disable import/no-cycle */
import { store } from 'src/Store';
import {
  RSA_OAEP_ALGORITHM, wca, PBKDF2_DERIVE_PASSWORD_HASH_ALGORITHM,
  PBKDF2_DERIVE_PASSWORD_KEY_ALGORITHM, AES_CBC_PASSWORD_KEY_ALGORITHM,
  AES_CBC_PASSWORD_KEY_GEN_ALGORITHM, RSA_OAEP_GEN_ALGORITHM,
  RSA_PSS_GEN_ALGORITHM, FINGERPRINT_ALGORITHM, RSA_OAEP_IMPORT_ALGORITHM,
  RSA_PSS_IMPORT_ALGORITHM,
  RSA_PSS_ALGORITHM,
} from './config';
import {
  arrayBufferToBase64, base64StringToArrayBuffer, stringToArrayBuffer,
  arrayBufferToString, blobToArrayBuffer,
} from './utils';
import {
  saveKeysToPKI, saveKeyInfo,
} from '../firebase/firestore';
import {
  getPasswordKey, getRSAOAEPPublicKey, getRSAOAEPPrivateKey,
  getRSAPSSPrivateKey, getRSAPSSPublicKey, getDataNameCryptoKey, getIVDataNameCryptoKey,
} from '../localforage';

// keep
export const newPBKDF2Salt = (
  byteSize: number,
): Promise<string> => Promise
  .resolve(window.crypto.getRandomValues(new Uint8Array(byteSize)))
  .then((arrayBuffer) => (arrayBufferToBase64(arrayBuffer)));

// keep
export const derivePasswordHash = (
  password: string, saltPasswordHash: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(password))
  .then((keyMaterial) => wca.importKey('raw', keyMaterial, 'PBKDF2', false, ['deriveBits']))
  .then((cryptoKey) => wca
    .deriveBits(
      PBKDF2_DERIVE_PASSWORD_HASH_ALGORITHM(base64StringToArrayBuffer(saltPasswordHash)),
      cryptoKey,
      512,
    ))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const derivePasswordKey = (
  password: string, saltPasswordKey: string,
): Promise<CryptoKey> => Promise
  .resolve(stringToArrayBuffer(password))
  .then((keyMaterial) => wca.importKey('raw', keyMaterial, 'PBKDF2', false, ['deriveKey']))
  .then((cryptoKey) => wca
    .deriveKey(
      PBKDF2_DERIVE_PASSWORD_KEY_ALGORITHM(base64StringToArrayBuffer(saltPasswordKey)),
      cryptoKey,
      AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(),
      true,
      ['encrypt', 'decrypt'],
    ));

// keep
export const generateRSAOAEPKeyPair = (
): Promise<CryptoKeyPair> => Promise
  .resolve(wca.generateKey(RSA_OAEP_GEN_ALGORITHM(), true, ['encrypt', 'decrypt']));

// keep
export const generateRSAPSSKeyPair = (
): Promise<CryptoKeyPair> => Promise
  .resolve(wca.generateKey(RSA_PSS_GEN_ALGORITHM(), true, ['sign', 'verify']));

// keep
export const newIV = (
): Promise<string> => Promise
  .resolve(window.crypto.getRandomValues(new Uint8Array(16)))
  .then((arrayBuffer) => (arrayBufferToBase64(arrayBuffer)));

// keep
export const encryptPrivateKey = (
  cryptoKey: CryptoKey, iv: string, privateKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.exportKey('pkcs8', privateKey))
  .then((arrayBuffer) => wca
    .encrypt(
      AES_CBC_PASSWORD_KEY_ALGORITHM(base64StringToArrayBuffer(iv)),
      cryptoKey,
      arrayBuffer,
    ))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const exportSymmetricKey = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.exportKey('raw', cryptoKey))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const exportToPublicPEM = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.exportKey('spki', cryptoKey))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const exportToPrivatePEM = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.exportKey('pkcs8', cryptoKey))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const generateDataNameKey = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.generateKey(AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(), true, ['encrypt', 'decrypt']))
  .then((aesCryptoKey) => wca.exportKey('raw', aesCryptoKey))
  .then((arrayBuffer) => wca.encrypt(RSA_OAEP_ALGORITHM(), cryptoKey, arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const createFingerprint = (
  string: string,
): Promise<string> => Promise
  .resolve(base64StringToArrayBuffer(string))
  .then((arrayBuffer) => wca.digest(FINGERPRINT_ALGORITHM, arrayBuffer))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

// keep
export const createBlobFingerprint = (
  file: File,
): Promise<string> => Promise
  .resolve(blobToArrayBuffer(file))
  .then((arrayBuffer) => wca.digest(FINGERPRINT_ALGORITHM, arrayBuffer))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''));

// keep
export const importDataNameKey = (
  key: string, publicRSAOAEP: CryptoKey,
): Promise<CryptoKey> => Promise
  .resolve(base64StringToArrayBuffer(key))
  .then((arrayBuffer) => wca.decrypt(RSA_OAEP_ALGORITHM(), publicRSAOAEP, arrayBuffer))
  .then((arrayBuffer) => wca.importKey(
    'raw', arrayBuffer, AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(), true, ['encrypt', 'decrypt'],
  ));

// keep
export const importRSAOAEPPrivateKey = (
  key: string, passwordKey: CryptoKey, ivRSAOAEP: string,
): Promise<CryptoKey> => Promise
  .resolve(base64StringToArrayBuffer(key))
  .then((arrayBuffer) => wca.decrypt(
    AES_CBC_PASSWORD_KEY_ALGORITHM(base64StringToArrayBuffer(ivRSAOAEP)), passwordKey, arrayBuffer,
  ))
  .then((arrayBuffer) => wca.importKey(
    'pkcs8', arrayBuffer, RSA_OAEP_IMPORT_ALGORITHM(), true, ['decrypt'],
  ));

// keep
export const importRSAOAEPPublicKey = (
  key: string,
): Promise<CryptoKey> => Promise
  .resolve(base64StringToArrayBuffer(key))
  .then((arrayBuffer) => wca.importKey(
    'spki', arrayBuffer, RSA_OAEP_IMPORT_ALGORITHM(), true, ['encrypt'],
  ));

// keep
export const importRSAPSSPrivateKey = (
  key: string, passwordKey: CryptoKey, ivRSAPSS: string,
): Promise<CryptoKey> => Promise
  .resolve(base64StringToArrayBuffer(key))
  .then((arrayBuffer) => wca.decrypt(
    AES_CBC_PASSWORD_KEY_ALGORITHM(base64StringToArrayBuffer(ivRSAPSS)), passwordKey, arrayBuffer,
  ))
  .then((arrayBuffer) => wca.importKey(
    'pkcs8', arrayBuffer, RSA_PSS_IMPORT_ALGORITHM(), true, ['sign'],
  ));

// keep
export const importRSAPSSPublicKey = (
  key: string,
): Promise<CryptoKey> => Promise
  .resolve(base64StringToArrayBuffer(key))
  .then((arrayBuffer) => wca.importKey(
    'spki', arrayBuffer, RSA_PSS_IMPORT_ALGORITHM(), true, ['verify'],
  ));

// keep
export const setupKeys = async (
  password: string, user: firebase.User,
): Promise<void> => {
  const saltPasswordKey = await newPBKDF2Salt(32);
  const passwordKey = await derivePasswordKey(password, saltPasswordKey);

  const rsaOAEPKeyPair = await generateRSAOAEPKeyPair();
  const rsaPSSKeyPair = await generateRSAPSSKeyPair();

  const ivRSAOAEP = await newIV();
  const privateRSAOAEPKey = await encryptPrivateKey(
    passwordKey, ivRSAOAEP, rsaOAEPKeyPair.privateKey,
  );
  const publicRSAOAEPKey = await exportToPublicPEM(rsaOAEPKeyPair.publicKey);

  const ivRSAPSS = await newIV();
  const privateRSAPSSKey = await encryptPrivateKey(passwordKey, ivRSAPSS, rsaPSSKeyPair.privateKey);
  const publicRSAPSSKey = await exportToPublicPEM(rsaPSSKeyPair.publicKey);

  const ivDataNameKey = await newIV();
  const dataNameKey = await generateDataNameKey(rsaOAEPKeyPair.publicKey);
  await saveKeysToPKI(user.uid, publicRSAOAEPKey, publicRSAPSSKey);
  await saveKeyInfo(user, {
    passwordKey: {
      salt: saltPasswordKey,
    },
    rsaOAEP: {
      iv: ivRSAOAEP,
      privateKey: privateRSAOAEPKey,
    },
    rsaPSS: {
      iv: ivRSAPSS,
      privateKey: privateRSAPSSKey,
    },
    dataNameKey: {
      iv: ivDataNameKey,
      key: dataNameKey,
    },
  });
};

// keep
export const changePasswordHash = (
  password: string, user: firebase.User,
): Promise<void> => setupKeys(password, user);

// keep
export const encryptWithAESCBC = (
  plaintext: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(plaintext))
  .then(async (arrayBuffer) => wca.encrypt(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    AES_CBC_PASSWORD_KEY_ALGORITHM(base64StringToArrayBuffer(store.getState().debug.aesCBC!!.iv)),
    await getPasswordKey(),
    arrayBuffer,
  ))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const decryptWithAESCBC = (
  ciphertext: string,
): Promise<string> => Promise
  .resolve(base64StringToArrayBuffer(ciphertext))
  .then(async (arrayBuffer) => wca.decrypt(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    AES_CBC_PASSWORD_KEY_ALGORITHM(base64StringToArrayBuffer(store.getState().debug.aesCBC!!.iv)),
    await getPasswordKey(),
    arrayBuffer,
  ))
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer));

// keep
export const encryptWithRSAOAEP = (
  plaintext: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(plaintext))
  .then(async (arrayBuffer) => wca.encrypt(
    RSA_OAEP_ALGORITHM(),
    await getRSAOAEPPublicKey(),
    arrayBuffer,
  ))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const decryptWithRSAOAEP = (
  ciphertext: string,
): Promise<string> => Promise
  .resolve(base64StringToArrayBuffer(ciphertext))
  .then(async (arrayBuffer) => wca.decrypt(
    RSA_OAEP_ALGORITHM(),
    await getRSAOAEPPrivateKey(),
    arrayBuffer,
  ))
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer));

// keep
export const signWithRSAPSS = (
  message: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(message))
  .then(async (arrayBuffer) => wca.sign(
    RSA_PSS_ALGORITHM(),
    await getRSAPSSPrivateKey(),
    arrayBuffer,
  ))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const verifyWithRSAPSS = (
  message: string, signature: string,
): Promise<boolean> => Promise
  .resolve(stringToArrayBuffer(message))
  .then(async (arrayBuffer) => wca.verify(
    RSA_PSS_ALGORITHM(),
    await getRSAPSSPublicKey(),
    base64StringToArrayBuffer(signature),
    arrayBuffer,
  ));

// keep
export const buildContainer = async (
  blob: Blob,
): Promise<Blob> => {
  const iv = await newIV().then((base64) => base64StringToArrayBuffer(base64));
  const key = await wca.generateKey(AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(), true, ['encrypt', 'decrypt']);
  const encryptedBlob = await Promise.resolve(blobToArrayBuffer(blob))
    .then((arrayBuffer) => wca.encrypt(AES_CBC_PASSWORD_KEY_ALGORITHM(iv), key, arrayBuffer));
  const encryptedKey = await Promise.resolve(exportSymmetricKey(key))
    .then((base64) => base64StringToArrayBuffer(base64))
    .then(async (arrayBuffer) => wca.encrypt(
      RSA_OAEP_ALGORITHM(), await getRSAOAEPPublicKey(), arrayBuffer,
    ));
  const signature = await Promise.resolve(getRSAPSSPrivateKey())
    .then((cryptoKey: CryptoKey) => wca.sign(RSA_PSS_ALGORITHM(), cryptoKey, encryptedBlob));
  return new Blob([encryptedBlob, iv, encryptedKey, signature]);
};

// keep
export const destroyContainer = async (
  blob: Blob,
): Promise<Blob> => {
  const arrayBuffer = await blobToArrayBuffer(blob);
  const { byteLength } = arrayBuffer;
  const encryptedKey = arrayBuffer.slice(byteLength - 512 - 512, byteLength - 512);
  const decryptedKey = await wca.decrypt(
    RSA_OAEP_ALGORITHM(), await getRSAOAEPPrivateKey(), encryptedKey,
  ).then((tmp) => wca.importKey(
    'raw', tmp, AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(), true, ['encrypt', 'decrypt'],
  ));
  const iv = arrayBuffer.slice(byteLength - 512 - 512 - 16, byteLength - 512 - 512);
  const encryptedBlob = arrayBuffer.slice(0, byteLength - 512 - 512 - 16);
  const decryptedBlob = await Promise.resolve(
    wca.decrypt(AES_CBC_PASSWORD_KEY_ALGORITHM(iv), decryptedKey, encryptedBlob),
  );
  const signature = arrayBuffer.slice(byteLength - 512, byteLength);
  const valid = await wca.verify(
    RSA_PSS_ALGORITHM(), await getRSAPSSPublicKey(), signature, encryptedBlob,
  );
  if (!valid) {
    throw new Error('The signature is not valid!');
  }
  return new Blob([decryptedBlob]);
};

// keep
export const encryptWithDataNameKey = (
  filename: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(filename))
  .then(async (arrayBuffer) => {
    const iv = await getIVDataNameCryptoKey()
      .then((base64) => base64StringToArrayBuffer(base64));
    const key = await getDataNameCryptoKey();
    return wca.encrypt(AES_CBC_PASSWORD_KEY_ALGORITHM(iv), key, arrayBuffer);
  })
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const decryptWithDataNameKey = (
  filename: string,
): Promise<string> => Promise
  .resolve(base64StringToArrayBuffer(filename))
  .then(async (arrayBuffer) => {
    const iv = await getIVDataNameCryptoKey()
      .then((base64) => base64StringToArrayBuffer(base64));
    const key = await getDataNameCryptoKey();
    return wca.decrypt(AES_CBC_PASSWORD_KEY_ALGORITHM(iv), key, arrayBuffer);
  })
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer));
