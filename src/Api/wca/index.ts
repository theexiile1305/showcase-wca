import { saveKeyStorage, getKeyStorage } from '../localforage';
import {
  RSA_OAEP_ALGORITHM, RSA_PSS_ALGORITHM, AES_CBC_ALGORITHM, wca,
} from './config';
import { decode, encode } from './utils';
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
  .then((pem) => encode(pem))
  .then((encodedPEM) => wca.digest('SHA-512', encodedPEM))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

const generatePrivateKeyFingerprint = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportPrivateCryptoKey(cryptoKey)
  .then((pem) => encode(pem))
  .then((encodedPEM) => wca.digest('SHA-512', encodedPEM))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

const generateSymmetricFingerprint = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportSymmetricCryptoKey(cryptoKey)
  .then((jsonWebKey) => JSON.stringify(jsonWebKey))
  .then((keyAsString) => encode(keyAsString))
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
  saveKeyStorage({
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
): Promise<string> => encryptDataWithAES(encode(text))
  .then((arrayBuffer) => decode(arrayBuffer));

export const decryptDataWithAES = (
  data: ArrayBuffer,
): Promise<ArrayBuffer> => getKeyStorage()
  .then((keyStorage) => keyStorage.aesCBC)
  .then((aesCBC) => wca.decrypt({ name: 'AES-CBC', iv: aesCBC.iv }, aesCBC.key, data));

export const decryptTextWithAES = (
  text: string,
): Promise<string> => decryptDataWithAES(encode(text))
  .then((arrayBuffer) => decode(arrayBuffer));

export const encryptDataWithRSAOAEP = (
  data: ArrayBuffer, publicKey: CryptoKey,
): PromiseLike<ArrayBuffer> => wca.encrypt('RSA-OAEP', publicKey, data);

export const encryptTextWithRSAOAEP = (
  text: string, publicKey: CryptoKey,
): PromiseLike<string> => encryptDataWithRSAOAEP(encode(text), publicKey)
  .then((arrayBuffer) => decode(arrayBuffer));

export const decryptDataWithRSAOAEP = (
  data: ArrayBuffer,
): Promise<ArrayBuffer> => getKeyStorage()
  .then((keyStorage) => keyStorage.rsaOAEP)
  .then((rsaOAEP) => wca.decrypt('RSA-OAEP', rsaOAEP.privateKey, data));

export const decryptTextWithRSAOAEP = (
  text: string,
): Promise<string> => decryptDataWithRSAOAEP(encode(text))
  .then((arrayBuffer) => decode(arrayBuffer));

export const verifyDataWithRSAPSS = (
  data: ArrayBuffer, signature: string, publicKey: CryptoKey,
): PromiseLike<boolean> => wca.verify('RSA-PSS', publicKey, encode(signature), data);


export const verifyTextWithRSAPSS = (
  text: string, signature: string, publicKey: CryptoKey,
): PromiseLike<boolean> => verifyDataWithRSAPSS(encode(text), signature, publicKey);

export const signDataWithRSAPSS = (
  data: ArrayBuffer,
): Promise<ArrayBuffer> => getKeyStorage()
  .then((keyStorage) => keyStorage.rsaOAEP)
  .then((rsaOAEP) => wca.sign('RSA-PSS', rsaOAEP.privateKey, data));

export const signTextWithRSAPSS = (
  text: string,
): Promise<string> => signDataWithRSAPSS(encode(text))
  .then((arrayBuffer) => decode(arrayBuffer));
