import store from 'src/Store';
import {
  RSA_OAEP_ALGORITHM, wca, PBKDF2_DERIVE_PASSWORD_HASH_ALGORITHM,
  PBKDF2_DERIVE_PASSWORD_KEY_ALGORITHM, AES_CBC_PASSWORD_KEY_ALGORITHM,
  AES_CBC_PASSWORD_KEY_GEN_ALGORITHM, RSA_OAEP_GEN_ALGORITHM,
  RSA_PSS_GEN_ALGORITHM, FINGERPRINT_ALGORITHM, RSA_OAEP_IMPORT_ALGORITHM,
  RSA_PSS_IMPORT_ALGORITHM,
} from './config';
import {
  arrayBufferToBase64, base64StringToArrayBuffer, stringToArrayBuffer, arrayBufferToString,
} from './utils';
import { saveKeysToPKI, saveKeyInfo } from '../firebase/firestore';

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
export const exportToPublicPEM = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.exportKey('spki', cryptoKey))
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
  password: string, userID: string,
): Promise<void> => {
  const saltPasswordKey = await newPBKDF2Salt(32);
  const passwordKey = await derivePasswordKey(password, saltPasswordKey);

  const rsaOAEPKeyPair = await generateRSAOAEPKeyPair();
  const rsaPSSKeyPair = await generateRSAPSSKeyPair();

  const ivRSAOAEP = await newIV();
  const privateRSAOAEPKey = await encryptPrivateKey(passwordKey, ivRSAOAEP, rsaOAEPKeyPair.privateKey);
  const publicRSAOAEPKey = await exportToPublicPEM(rsaOAEPKeyPair.publicKey);

  const ivRSAPSS = await newIV();
  const privateRSAPSSKey = await encryptPrivateKey(passwordKey, ivRSAPSS, rsaPSSKeyPair.privateKey);
  const publicRSAPSSKey = await exportToPublicPEM(rsaPSSKeyPair.publicKey);

  const ivDataNameKey = await newIV();
  const dataNameKey = await generateDataNameKey(rsaOAEPKeyPair.publicKey);
  await saveKeysToPKI(userID, publicRSAOAEPKey, publicRSAPSSKey);
  await saveKeyInfo(userID, {
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
  password: string, userID: string,
): Promise<void> => setupKeys(password, userID);

// keep
export const encryptWithAESCBC = (
  plaintext: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(plaintext))
  .then((arrayBuffer) => {
    const { key } = store.getState().crypto.passwordKey!!;
    const { iv } = store.getState().debug.aesCBC!!;
    return wca.encrypt(
      AES_CBC_PASSWORD_KEY_ALGORITHM(base64StringToArrayBuffer(iv)), key, arrayBuffer,
    );
  })
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const decryptWithAESCBC = (
  ciphertext: string,
): Promise<string> => Promise
  .resolve(base64StringToArrayBuffer(ciphertext))
  .then((arrayBuffer) => {
    const { key } = store.getState().crypto.passwordKey!!;
    const { iv } = store.getState().debug.aesCBC!!;
    return wca.decrypt(
      AES_CBC_PASSWORD_KEY_ALGORITHM(base64StringToArrayBuffer(iv)), key, arrayBuffer,
    );
  })
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer));

// keep
export const encryptWithRSAOAEP = (
  plaintext: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(plaintext))
  .then((arrayBuffer) => {
    const { publicKey } = store.getState().crypto.rsaOAEP!!;
    return wca.encrypt(RSA_OAEP_ALGORITHM(), publicKey, arrayBuffer);
  })
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const decryptWithRSAOAEP = (
  ciphertext: string,
): Promise<string> => Promise
  .resolve(base64StringToArrayBuffer(ciphertext))
  .then((arrayBuffer) => {
    const { privateKey } = store.getState().crypto.rsaOAEP!!;
    return wca.decrypt(RSA_OAEP_ALGORITHM(), privateKey, arrayBuffer);
  })
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer));

// keep
export const signWithRSAPSS = (
  message: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(message))
  .then((arrayBuffer) => {
    const { privateKey } = store.getState().crypto.rsaPSS!!;
    // change to RSA_PSS_ALGORITHM... CAUSE FAILURE -> WHY?
    return wca.sign({ name: 'RSA-PSS', saltLength: 0 }, privateKey, arrayBuffer);
  })
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

// keep
export const verifyWithRSAPSS = (
  message: string, signature: string,
): Promise<boolean> => Promise
  .resolve(stringToArrayBuffer(message))
  .then((arrayBuffer) => {
    const { publicKey } = store.getState().crypto.rsaPSS!!;
    return wca.verify(
      // change to RSA_PSS_ALGORITHM... CAUSE FAILURE -> WHY?
      { name: 'RSA-PSS', saltLength: 0 }, publicKey, base64StringToArrayBuffer(signature), arrayBuffer,
    );
  });
