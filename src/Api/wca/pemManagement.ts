import { arrayBufferToString } from './utils';
import { wca } from './config';

const PEM_PUBLIC_HEADER = '-----BEGIN PUBLIC KEY-----';
const PEM_PUBLIC_FOOTER = '-----END PUBLIC KEY-----';
const PEM_PRIVATE_HEADER = '-----BEGIN PRIVATE KEY-----';
const PEM_PRIVATE_FOOTER = '-----END PRIVATE KEY-----';

const importCryptoKey = (
  cryptoKey: ArrayBuffer, format: 'spki' | 'pkcs8', algorithm: string, keyUsages: string[],
): PromiseLike<CryptoKey> => wca
  .importKey(format, cryptoKey, algorithm, true, keyUsages);

export const importRSAOAEPPublicCryptoKey = (
  cryptoKey: ArrayBuffer,
): PromiseLike<CryptoKey> => importCryptoKey(cryptoKey, 'spki', 'RSA-OAEP', ['encrypt', 'decrypt']);

export const importRSAPSSPublicCryptoKey = (
  cryptoKey: ArrayBuffer,
): PromiseLike<CryptoKey> => importCryptoKey(cryptoKey, 'spki', 'RSA-PSS', ['sign', 'verify']);

const exportCryptoKey = (
  cryptoKey: CryptoKey, format: 'spki' | 'pkcs8', header: string, footer: string,
): PromiseLike<string> => wca
  .exportKey(format, cryptoKey)
  .then((exported) => arrayBufferToString(exported))
  .then((exportedAsString) => window.btoa(exportedAsString))
  .then((base64) => `${header}\n${base64}\n${footer}`);

export const exportPublicCryptoKey = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportCryptoKey(cryptoKey, 'spki', PEM_PUBLIC_HEADER, PEM_PUBLIC_FOOTER);

export const exportPrivateCryptoKey = (
  cryptoKey: CryptoKey,
): PromiseLike<string> => exportCryptoKey(cryptoKey, 'pkcs8', PEM_PRIVATE_HEADER, PEM_PRIVATE_FOOTER);

export const exportSymmetricCryptoKey = (
  cryptoKey: CryptoKey,
): PromiseLike<JsonWebKey> => wca.exportKey('jwk', cryptoKey);
