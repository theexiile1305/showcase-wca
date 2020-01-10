import { saveKeyStorage, getKeyStorage } from '../localforage';
import {
  RSA_OAEP_ALGORITHM, wca, PBKDF2_ALGORITHM, AES_CBC_ENCRYPTION_ALGORITHM, PBKDF2_DERIVE_PASSWORD_HASH_ALGORITHM, PBKDF2_DERIVE_PASSWORD_KEY_ALGORITHM, AES_CBC_PASSWORD_KEY_ALGORITHM, AES_CBC_PASSWORD_KEY_GEN_ALGORITHM, RSA_OAEP_GEN_ALGORITHM, RSA_PSS_GEN_ALGORITHM, FINGERPRINT_ALGORITHM, RSA_OAEP_IMPORT_ALGORITHM, RSA_PSS_IMPORT_ALGORITHM,
} from './config';
import { exportSymmetricCryptoKey, exportPublicCryptoKey, exportPrivateCryptoKey } from './pemManagement';
import {
  arrayBufferToBase64, base64StringToArrayBuffer, stringToArrayBuffer,
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
    AES_CBC_ENCRYPTION_ALGORITHM(base64StringToArrayBuffer(ivRSAOAEP)), passwordKey, arrayBuffer,
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
    AES_CBC_ENCRYPTION_ALGORITHM(base64StringToArrayBuffer(ivRSAPSS)), passwordKey, arrayBuffer,
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
export const encryptWithAES = (
  string: string,
): Promise<string> => Promise
  .resolve('');

// stop
const deriveAESCBCkWithPBKDF2 = (
  password: string, salt: string,
): Promise<void> => Promise
  .resolve(base64StringToArrayBuffer(password))
  .then((keyMaterial) => wca.importKey('raw', keyMaterial, 'PBKDF2', false, ['deriveBits', 'deriveKey']))
  .then((cryptoKey) => {
    const rawSalt = base64StringToArrayBuffer(salt);
    // return wca.deriveKey(PBKDF2_ALGORITHM(rawSalt), cryptoKey, AES_CBC_ALGORITHM, true, ['encrypt', 'decrypt']);
  });
const encryptRawCryptoKey = (
  rawCryptoKey: CryptoKey, cryptoKey: CryptoKey, iv: ArrayBuffer,
): Promise<string> => Promise
  .resolve(wca.exportKey('raw', rawCryptoKey))
  .then((arrayBuffer) => wca.encrypt(AES_CBC_ENCRYPTION_ALGORITHM(iv), cryptoKey, arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));


export const hash = (
  password: string,
): Promise<string> => Promise
  .resolve(window.btoa(password))
  .then((base64) => base64StringToArrayBuffer(base64))
  .then((arrayBuffer) => wca.digest('SHA-512', arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer))
  .then((string) => window.btoa(string));

export const encrypWithAESCBC = (
  cryptoKey: CryptoKey, data: string,
): Promise<string> => Promise
  .resolve(window.btoa(data))
  .then((base64) => base64StringToArrayBuffer(base64))
  .then((arrayBuffer) => wca.encrypt(AES_CBC_ENCRYPTION_ALGORITHM, cryptoKey, arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer))
  .then((string) => window.btoa(string));

const generatePublicKeyFingerprint = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportPublicCryptoKey(cryptoKey)
  .then((pem) => base64StringToArrayBuffer(pem))
  .then((encodedPEM) => wca.digest('SHA-512', encodedPEM))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

const generatePrivateKeyFingerprint = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportPrivateCryptoKey(cryptoKey)
  .then((pem) => base64StringToArrayBuffer(pem))
  .then((encodedPEM) => wca.digest('SHA-512', encodedPEM))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

const generateSymmetricFingerprint = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportSymmetricCryptoKey(cryptoKey)
  .then((jsonWebKey) => JSON.stringify(jsonWebKey))
  .then((keyAsString) => base64StringToArrayBuffer(keyAsString))
  .then((encodedPEM) => wca.digest('SHA-512', encodedPEM))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));


export const setupKeys2 = async (
  password: string,
): Promise<void> => {
  const salt = window.crypto.getRandomValues(new Uint8Array(32)); // --> save salt elsewehre non encrypted
  const ivPasswordKey = window.crypto.getRandomValues(new Uint8Array(16)); // save iv elsewehre non encrypted

  // const passwordKey = await deriveAESCBCkWithPBKDF2(password, salt);
  const rsaOAEP = await generateRSAOAEPKeyPair();
  const rsaPSS = await generateRSAPSSKeyPair();
  // const aesCBC = await generateAESCBCKey();
  const publicRSAOAEP = rsaOAEP.publicKey; // --> share key with other user
  const publicRSAPSS = rsaPSS.publicKey; // --> share key with other user

  // const encPrivateRSAOAEP = encryptCryptoKey(rsaOAEP.privateKey, passwordKey, ivPasswordKey); // --> save key in own storage
  // const encPrivateRSAPSS = encryptCryptoKey(rsaPSS.privateKey, passwordKey, ivPasswordKey); // --> save key in own storage
  // const encAESCBC = encryptCryptoKey(aesCBC, passwordKey, ivPasswordKey); // --> save key in own storage


  const keys = await Promise.all([
    generateRSAOAEPKeyPair(),
    generateRSAPSSKeyPair(),
    //   generateSymmetricKey(password, salt),
  ]);
  const fingerprint = await Promise.all([
    generatePublicKeyFingerprint(keys[0].publicKey),
    generatePrivateKeyFingerprint(keys[0].privateKey),
    generatePublicKeyFingerprint(keys[1].publicKey),
    generatePrivateKeyFingerprint(keys[1].privateKey),
    // generateSymmetricFingerprint(keys[2]),
  ]);
  const vec = window.crypto.getRandomValues(new Uint8Array(16));
  // await saveKeyStorage({
  //   rsaOAEP: {
  //     publicKey: keys[0].publicKey,
  //     privateKey: keys[0].privateKey,
  //     publicKeyFingerprint: fingerprint[0],
  //     privateKeyFingerprint: fingerprint[1],
  //   },
  //   rsaPSS: {
  //     publicKey: keys[1].publicKey,
  //     privateKey: keys[1].privateKey,
  //     publicKeyFingerprint: fingerprint[2],
  //     privateKeyFingerprint: fingerprint[3],
  //   },
  // //  aesCBC: {
  //     // key: keys[2],
  //     iv: vec,
  //   //  fingerprint: fingerprint[4],
  //   },
  // });
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
  .then((base64) => base64StringToArrayBuffer(base64))
  .then((arrayBuffer) => encryptDataWithAES(arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer))
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
  .then((text) => base64StringToArrayBuffer(text))
  .then((arrayBuffer) => decryptDataWithAES(arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer))
  .then((text) => window.atob(text));

export const encryptDataWithRSAOAEP = (
  data: ArrayBuffer, publicKey: CryptoKey,
): Promise<ArrayBuffer> => Promise.resolve(wca.encrypt('RSA-OAEP', publicKey, data));

export const encryptTextWithRSAOAEP = (
  text: string, publicKey: CryptoKey,
): Promise<string> => Promise
  .resolve(window.btoa(text))
  .then((base64) => base64StringToArrayBuffer(base64))
  .then((arrayBuffer) => encryptDataWithRSAOAEP(arrayBuffer, publicKey))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer))
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
  .then((text) => base64StringToArrayBuffer(text))
  .then((arrayBuffer) => decryptDataWithRSAOAEP(arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer))
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
  .then((base64) => base64StringToArrayBuffer(base64))
  .then((arrayBuffer) => signDataWithRSAPSS(arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer))
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
  .then((text) => base64StringToArrayBuffer(text))
  .then((arrayBuffer) => {
    const base64 = window.btoa(message);
    const rawMessage = base64StringToArrayBuffer(base64);
    return verifyDataWithRSAPSS(rawMessage, arrayBuffer, publicKey);
  });
