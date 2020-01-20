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
  base64StringToArrayBuffer, stringToArrayBuffer,
  arrayBufferToString, blobToArrayBuffer, arrayBufferToBase64, concatenate,
} from './utils';
import {
  saveKeysToPKI, saveKeyInfo, getRSAPSSPublicKey as getRSAPSSPublicKeyPath,
} from '../firebase/firestore';
import {
  getPasswordKey, getRSAOAEPPublicKey, getRSAOAEPPrivateKey,
  getRSAPSSPrivateKey, getRSAPSSPublicKey, getDataNameCryptoKey, getIVDataNameCryptoKey,
} from '../localforage';
import {
  BEGIN_SIGNATURE, END_SIGNATURE, BEGIN_SIGNATURE_USER_ID, END_SIGNATURE_USER_ID,
  BEGIN_COUNTER, END_COUNTER, BEGIN_AES_KEYS_BLOCK, END_AES_KEYS_BLOCK, BEGIN_IV,
  END_IV, BEGIN_BLOB, END_BLOB, SINGLE_AES_BLOCK_SIZE, USER_ID_SIZE, AES_KEY_SIZE,
} from './containerConfig';
import { downloadKey } from '../firebase/storage';

export const newPBKDF2Salt = (
  byteSize: number,
): Promise<string> => Promise
  .resolve(window.crypto.getRandomValues(new Uint8Array(byteSize)))
  .then((arrayBuffer) => (arrayBufferToBase64(arrayBuffer)));

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

export const generateRSAOAEPKeyPair = (
): Promise<CryptoKeyPair> => Promise
  .resolve(wca.generateKey(RSA_OAEP_GEN_ALGORITHM(), true, ['encrypt', 'decrypt']));

export const generateRSAPSSKeyPair = (
): Promise<CryptoKeyPair> => Promise
  .resolve(wca.generateKey(RSA_PSS_GEN_ALGORITHM(), true, ['sign', 'verify']));

export const newIV = (
): Promise<string> => Promise
  .resolve(window.crypto.getRandomValues(new Uint8Array(16)))
  .then((arrayBuffer) => (arrayBufferToBase64(arrayBuffer)));

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

export const exportSymmetricKey = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.exportKey('raw', cryptoKey))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

export const exportToPublicPEM = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.exportKey('spki', cryptoKey))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

export const exportToPrivatePEM = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.exportKey('pkcs8', cryptoKey))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

export const generateDataNameKey = (
  cryptoKey: CryptoKey,
): Promise<string> => Promise
  .resolve(wca.generateKey(AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(), true, ['encrypt', 'decrypt']))
  .then((aesCryptoKey) => wca.exportKey('raw', aesCryptoKey))
  .then((arrayBuffer) => wca.encrypt(RSA_OAEP_ALGORITHM(), cryptoKey, arrayBuffer))
  .then((arrayBuffer) => arrayBufferToBase64(arrayBuffer));

export const createHash = (
  string: string,
): Promise<string> => Promise
  .resolve(stringToArrayBuffer(string))
  .then((arrayBuffer) => wca.digest(FINGERPRINT_ALGORITHM, arrayBuffer))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''));

export const createFingerprint = (
  string: string,
): Promise<string> => Promise
  .resolve(base64StringToArrayBuffer(string))
  .then((arrayBuffer) => wca.digest(FINGERPRINT_ALGORITHM, arrayBuffer))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(':'));

export const createBlobFingerprint = (
  file: File,
): Promise<string> => Promise
  .resolve(blobToArrayBuffer(file))
  .then((arrayBuffer) => wca.digest(FINGERPRINT_ALGORITHM, arrayBuffer))
  .then((hashBuffer) => Array.from(new Uint8Array(hashBuffer)))
  .then((hashArray) => hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''));

export const importDataNameKey = (
  key: string, publicRSAOAEP: CryptoKey,
): Promise<CryptoKey> => Promise
  .resolve(base64StringToArrayBuffer(key))
  .then((arrayBuffer) => wca.decrypt(RSA_OAEP_ALGORITHM(), publicRSAOAEP, arrayBuffer))
  .then((arrayBuffer) => wca.importKey(
    'raw', arrayBuffer, AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(), true, ['encrypt', 'decrypt'],
  ));

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

export const importRSAOAEPPublicKey = (
  key: string,
): Promise<CryptoKey> => Promise
  .resolve(base64StringToArrayBuffer(key))
  .then((arrayBuffer) => wca.importKey(
    'spki', arrayBuffer, RSA_OAEP_IMPORT_ALGORITHM(), true, ['encrypt'],
  ));

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

export const importRSAPSSPublicKey = (
  key: string,
): Promise<CryptoKey> => Promise
  .resolve(base64StringToArrayBuffer(key))
  .then((arrayBuffer) => wca.importKey(
    'spki', arrayBuffer, RSA_PSS_IMPORT_ALGORITHM(), true, ['verify'],
  ));

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

export const buildContainer = async (
  plaintextBlob: Blob,
): Promise<Blob> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userID = store.getState().user.uid!!;
  const iv = await newIV().then((base64) => base64StringToArrayBuffer(base64));
  const key = await wca.generateKey(AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(), true, ['encrypt', 'decrypt']);
  const encryptedBlob = await Promise.resolve(blobToArrayBuffer(plaintextBlob))
    .then((arrayBuffer) => wca.encrypt(AES_CBC_PASSWORD_KEY_ALGORITHM(iv), key, arrayBuffer));
  const encryptedKey = await Promise.resolve(exportSymmetricKey(key))
    .then((base64) => base64StringToArrayBuffer(base64))
    .then(async (arrayBuffer) => wca.encrypt(
      RSA_OAEP_ALGORITHM(), await getRSAOAEPPublicKey(), arrayBuffer,
    ));
  const counter = new Uint8Array([0]);
  const signature = await Promise.resolve(getRSAPSSPrivateKey())
    .then((cryptoKey: CryptoKey) => wca.sign(RSA_PSS_ALGORITHM(), cryptoKey, encryptedBlob));
  return new Blob([encryptedBlob, iv, userID, encryptedKey, counter, userID, signature]);
};

const determineCounterValue = (
  counter: ArrayBuffer,
): number => new DataView(counter, 0).getUint8(0);

const verifySignature = async (
  encryptedBlob: ArrayBuffer, signature: ArrayBuffer, signatureUserID: ArrayBuffer,
): Promise<boolean> => Promise
  .resolve(arrayBufferToString(signatureUserID))
  .then((userID) => getRSAPSSPublicKeyPath(userID))
  .then((path) => downloadKey(path))
  .then((cryptoKey) => importRSAPSSPublicKey(cryptoKey))
  .then((cryptoKey) => wca.verify(RSA_PSS_ALGORITHM(), cryptoKey, signature, encryptedBlob));

const determineEncryptedKey = (
  aesKeyBlock: ArrayBuffer, counterValue: number,
): ArrayBuffer => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userID = store.getState().user.uid!!;
  let encryptedKey;
  for (let index = 0;
    index < counterValue * SINGLE_AES_BLOCK_SIZE;
    index += SINGLE_AES_BLOCK_SIZE) {
    const currentUserID = aesKeyBlock.slice(index, index + USER_ID_SIZE);
    if (arrayBufferToString(currentUserID) === userID) {
      encryptedKey = aesKeyBlock.slice(index + USER_ID_SIZE, index + USER_ID_SIZE + AES_KEY_SIZE);
    }
  }
  if (encryptedKey === undefined) {
    throw new Error('There were no publicKey found.');
  }
  return encryptedKey;
};

const decryptBlob = (
  encryptedBlob: ArrayBuffer, counterIndex: number, iv: ArrayBuffer, aesKeyBlock: ArrayBuffer,
): Promise<ArrayBuffer> => Promise
  .resolve(determineEncryptedKey(aesKeyBlock, counterIndex + 1))
  .then(async (arrayBuffer) => wca.decrypt(
    RSA_OAEP_ALGORITHM(), await getRSAOAEPPrivateKey(), arrayBuffer,
  ))
  .then((arrayBuffer) => wca.importKey('raw', arrayBuffer, AES_CBC_PASSWORD_KEY_GEN_ALGORITHM(), true, ['encrypt', 'decrypt']))
  .then((cryptoKey) => wca.decrypt(AES_CBC_PASSWORD_KEY_ALGORITHM(iv), cryptoKey, encryptedBlob));

export const destroyContainer = async (
  blob: Blob,
): Promise<Blob> => {
  const arrayBuffer = await blobToArrayBuffer(blob);
  const { byteLength } = arrayBuffer;
  const counterIndex = determineCounterValue(
    arrayBuffer.slice(BEGIN_COUNTER(byteLength), END_COUNTER(byteLength)),
  );
  const encryptedBlob = arrayBuffer.slice(BEGIN_BLOB(), END_BLOB(byteLength, counterIndex));
  const valid = await verifySignature(
    encryptedBlob,
    arrayBuffer.slice(BEGIN_SIGNATURE(byteLength), END_SIGNATURE(byteLength)),
    arrayBuffer.slice(BEGIN_SIGNATURE_USER_ID(byteLength), END_SIGNATURE_USER_ID(byteLength)),
  );
  if (!valid) {
    throw new Error('The signature is not valid!');
  }
  const decryptedBlob = await decryptBlob(
    encryptedBlob, counterIndex,
    arrayBuffer.slice(BEGIN_IV(byteLength, counterIndex), END_IV(byteLength, counterIndex)),
    arrayBuffer.slice(
      BEGIN_AES_KEYS_BLOCK(byteLength, counterIndex), END_AES_KEYS_BLOCK(byteLength),
    ),
  );
  return new Blob([decryptedBlob]);
};

const deriveNewEncryptedAESKey = (
  aesKeyBlock: ArrayBuffer, counterIndex: number, cryptoKey: CryptoKey,
): Promise<ArrayBuffer> => Promise
  .resolve(determineEncryptedKey(aesKeyBlock, counterIndex + 1))
  .then(async (arrayBuffer) => wca.decrypt(
    RSA_OAEP_ALGORITHM(), await getRSAOAEPPrivateKey(), arrayBuffer,
  ))
  .then((arrayBuffer) => wca.encrypt(RSA_OAEP_ALGORITHM(), cryptoKey, arrayBuffer));

export const addSharingToContainer = async (
  blob: Blob, userID: string, cryptoKey: CryptoKey,
): Promise<Blob> => {
  const arrayBuffer = await blobToArrayBuffer(blob);
  const { byteLength } = arrayBuffer;
  const counterIndex = determineCounterValue(
    arrayBuffer.slice(BEGIN_COUNTER(byteLength), END_COUNTER(byteLength)),
  );
  const encryptedBlob = arrayBuffer.slice(BEGIN_BLOB(), END_BLOB(byteLength, counterIndex));
  const iv = arrayBuffer.slice(
    BEGIN_IV(byteLength, counterIndex), END_IV(byteLength, counterIndex),
  );
  const aesKeyBlock = arrayBuffer.slice(
    BEGIN_AES_KEYS_BLOCK(byteLength, counterIndex), END_AES_KEYS_BLOCK(byteLength),
  );
  const newUserID = stringToArrayBuffer(userID);
  const newEncryptedKey = await deriveNewEncryptedAESKey(aesKeyBlock, counterIndex, cryptoKey);
  const newCounterIndex = new Uint8Array([counterIndex + 1]);
  const signature = arrayBuffer.slice(BEGIN_SIGNATURE(byteLength), END_SIGNATURE(byteLength));
  const signatureUserID = arrayBuffer.slice(
    BEGIN_SIGNATURE_USER_ID(byteLength), END_SIGNATURE_USER_ID(byteLength),
  );
  const valid = await verifySignature(encryptedBlob, signature, signatureUserID);
  if (!valid) {
    throw new Error('The signature is not valid!');
  }
  return new Blob([
    encryptedBlob, iv, aesKeyBlock, newUserID, newEncryptedKey, newCounterIndex,
    signatureUserID, signature,
  ]);
};

const reovkeEncryptedKey = (
  aesKeyBlock: ArrayBuffer, counterValue: number, userID: string,
): ArrayBuffer => {
  let array = new Uint8Array();
  for (let index = 0;
    index < counterValue * SINGLE_AES_BLOCK_SIZE;
    index += SINGLE_AES_BLOCK_SIZE) {
    const currentUserID = aesKeyBlock.slice(index, index + USER_ID_SIZE);
    if (arrayBufferToString(currentUserID) !== userID) {
      const currentArrayBuffer = new Uint8Array(
        (aesKeyBlock.slice(index, index + SINGLE_AES_BLOCK_SIZE)),
      );
      array = concatenate(array, currentArrayBuffer);
    }
  }
  return array;
};

export const revokeSharingToContainer = async (
  blob: Blob, userID: string,
): Promise<Blob> => {
  const arrayBuffer = await blobToArrayBuffer(blob);
  const { byteLength } = arrayBuffer;
  const counterIndex = determineCounterValue(
    arrayBuffer.slice(BEGIN_COUNTER(byteLength), END_COUNTER(byteLength)),
  );
  const encryptedBlob = arrayBuffer.slice(BEGIN_BLOB(), END_BLOB(byteLength, counterIndex));
  const iv = arrayBuffer.slice(
    BEGIN_IV(byteLength, counterIndex), END_IV(byteLength, counterIndex),
  );
  const aesKeyBlock = arrayBuffer.slice(
    BEGIN_AES_KEYS_BLOCK(byteLength, counterIndex), END_AES_KEYS_BLOCK(byteLength),
  );
  const newAESKeyBlock = reovkeEncryptedKey(aesKeyBlock, counterIndex + 1, userID);
  const newCounterIndex = new Uint8Array([counterIndex - 1]);
  const signature = arrayBuffer.slice(BEGIN_SIGNATURE(byteLength), END_SIGNATURE(byteLength));
  const signatureUserID = arrayBuffer.slice(
    BEGIN_SIGNATURE_USER_ID(byteLength), END_SIGNATURE_USER_ID(byteLength),
  );
  const valid = await verifySignature(encryptedBlob, signature, signatureUserID);
  if (!valid) {
    throw new Error('The signature is not valid!');
  }
  return new Blob([
    encryptedBlob, iv, newAESKeyBlock, newCounterIndex, signatureUserID, signature,
  ]);
};


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
