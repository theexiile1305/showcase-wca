import { saveKeyStorage, getKeyStorage } from '../localforage';
import {
  RSA_OAEP_ALGORITHM, RSA_PSS_ALGORITHM, AES_CBC_ALGORITHM, wca,
} from './config';
import { stringToArrayBuffer, arrayBufferToString } from './utils';
import { exportSymmetricCryptoKey, exportPublicCryptoKey, exportPrivateCryptoKey } from './pemManagement';

const generateRSAOAEPKeyPair = (
): PromiseLike<CryptoKeyPair> => wca.generateKey(RSA_OAEP_ALGORITHM, true, ['encrypt', 'decrypt']);

const generateRSAPSSKeyPair = (
): PromiseLike<CryptoKeyPair> => wca.generateKey(RSA_PSS_ALGORITHM, true, ['sign', 'verify']);

const generateSymmetricKey = (
): PromiseLike<CryptoKey> => wca.generateKey(AES_CBC_ALGORITHM, true, ['encrypt', 'decrypt']);

const generatePublicKeyFingerprint = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportPublicCryptoKey(cryptoKey)
  .then((pem) => stringToArrayBuffer(pem))
  .then((encodedPEM) => wca.digest('SHA-512', encodedPEM))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

const generatePrivateKeyFingerprint = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportPrivateCryptoKey(cryptoKey)
  .then((pem) => stringToArrayBuffer(pem))
  .then((encodedPEM) => wca.digest('SHA-512', encodedPEM))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

const generateSymmetricFingerprint = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportSymmetricCryptoKey(cryptoKey)
  .then((jsonWebKey) => JSON.stringify(jsonWebKey))
  .then((keyAsString) => stringToArrayBuffer(keyAsString))
  .then((encodedPEM) => wca.digest('SHA-512', encodedPEM))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

export const setupKeys = async (
): Promise<void> => {
  const keys = await Promise.all([
    generateRSAOAEPKeyPair(),
    generateRSAPSSKeyPair(),
    generateSymmetricKey(),
  ]);
  const fingerprint = await Promise.all([
    generatePublicKeyFingerprint(keys[0].publicKey),
    generatePrivateKeyFingerprint(keys[0].privateKey),
    generatePublicKeyFingerprint(keys[1].publicKey),
    generatePrivateKeyFingerprint(keys[1].privateKey),
    generateSymmetricFingerprint(keys[2]),
  ]);
  const vec = window.crypto.getRandomValues(new Uint8Array(16));
  await saveKeyStorage({
    rsaOAEP: {
      publicKey: keys[0].publicKey,
      privateKey: keys[0].privateKey,
      publicKeyFingerprint: fingerprint[0],
      privateKeyFingerprint: fingerprint[1],
    },
    rsaPSS: {
      publicKey: keys[1].publicKey,
      privateKey: keys[1].privateKey,
      publicKeyFingerprint: fingerprint[2],
      privateKeyFingerprint: fingerprint[3],
    },
    aesCBC: {
      key: keys[2],
      iv: vec,
      fingerprint: fingerprint[4],
    },
  });
};

export const encryptDataWithAES = (
  data: ArrayBuffer,
): Promise<ArrayBuffer> => getKeyStorage()
  .then((keyStorage) => keyStorage.aesCBC)
  .then((aesCBC) => wca.encrypt({ name: 'AES-CBC', iv: aesCBC.iv }, aesCBC.key, data));

export const encryptTextWithAES = (
  text: string,
): Promise<string> => Promise
  .resolve(window.btoa(text))
  .then((base64) => stringToArrayBuffer(base64))
  .then((arrayBuffer) => encryptDataWithAES(arrayBuffer))
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer))
  .then((string) => window.btoa(string));

export const decryptDataWithAES = (
  data: ArrayBuffer,
): Promise<ArrayBuffer> => getKeyStorage()
  .then((keyStorage) => keyStorage.aesCBC)
  .then((aesCBC) => wca.decrypt({ name: 'AES-CBC', iv: aesCBC.iv }, aesCBC.key, data));

export const decryptTextWithAES = (
  base64: string,
): Promise<string> => Promise
  .resolve(window.atob(base64))
  .then((text) => stringToArrayBuffer(text))
  .then((arrayBuffer) => decryptDataWithAES(arrayBuffer))
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer))
  .then((text) => window.atob(text));

export const encryptDataWithRSAOAEP = (
  data: ArrayBuffer, publicKey: CryptoKey,
): Promise<ArrayBuffer> => Promise.resolve(wca.encrypt('RSA-OAEP', publicKey, data));

export const encryptTextWithRSAOAEP = (
  text: string, publicKey: CryptoKey,
): Promise<string> => Promise
  .resolve(window.btoa(text))
  .then((base64) => stringToArrayBuffer(base64))
  .then((arrayBuffer) => encryptDataWithRSAOAEP(arrayBuffer, publicKey))
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer))
  .then((string) => window.btoa(string));

export const decryptDataWithRSAOAEP = (
  data: ArrayBuffer,
): Promise<ArrayBuffer> => getKeyStorage()
  .then((keyStorage) => keyStorage.rsaOAEP)
  .then((rsaOAEP) => wca.decrypt('RSA-OAEP', rsaOAEP.privateKey, data));

export const decryptTextWithRSAOAEP = (
  base64: string,
): Promise<string> => Promise
  .resolve(window.atob(base64))
  .then((text) => stringToArrayBuffer(text))
  .then((arrayBuffer) => decryptDataWithRSAOAEP(arrayBuffer))
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer))
  .then((text) => window.atob(text));

export const signDataWithRSAPSS = (
  data: ArrayBuffer,
): Promise<ArrayBuffer> => getKeyStorage()
  .then((keyStorage) => keyStorage.rsaPSS)
  .then((rsaPSS) => wca.sign({ name: 'RSA-PSS', saltLength: 0 }, rsaPSS.privateKey, data));

export const signTextWithRSAPSS = (
  text: string,
): Promise<string> => Promise
  .resolve(window.btoa(text))
  .then((base64) => stringToArrayBuffer(base64))
  .then((arrayBuffer) => signDataWithRSAPSS(arrayBuffer))
  .then((arrayBuffer) => arrayBufferToString(arrayBuffer))
  .then((string) => window.btoa(string));

export const verifyDataWithRSAPSS = (
  data: ArrayBuffer, signature: ArrayBuffer, publicKey: CryptoKey,
): Promise<boolean> => Promise.resolve(
  wca.verify({ name: 'RSA-PSS', saltLength: 0 }, publicKey, signature, data),
);

export const verifyTextWithRSAPSS = (
  message: string, signatureBase64: string, publicKey: CryptoKey,
): Promise<boolean> => Promise
  .resolve(window.atob(signatureBase64))
  .then((text) => stringToArrayBuffer(text))
  .then((arrayBuffer) => {
    const base64 = window.btoa(message);
    const rawMessage = stringToArrayBuffer(base64);
    return verifyDataWithRSAPSS(rawMessage, arrayBuffer, publicKey);
  });
