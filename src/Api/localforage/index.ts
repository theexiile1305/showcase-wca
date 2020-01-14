import { CryptoKeys } from 'src/Models/CryptoKeys';
import store from './config';

const KEY_STORAGE = 'keyStorage';

const getCryptoKeys = (
): Promise<CryptoKeys> => store.getItem(KEY_STORAGE);

export const removeCryptoKeys = (
): Promise<void> => store.removeItem(KEY_STORAGE);

export const saveCryptoKeys = (
  cryptoKeys: CryptoKeys,
): Promise<CryptoKeys> => store.setItem(KEY_STORAGE, cryptoKeys);

export const getPasswordKey = (
): Promise<CryptoKey> => getCryptoKeys().then((cryptoKeys) => cryptoKeys.passwordKey.key);

export const getRSAOAEPPublicKey = (
): Promise<CryptoKey> => getCryptoKeys().then((cryptoKeys) => cryptoKeys.rsaOAEP.publicKey);

export const getRSAOAEPPrivateKey = (
): Promise<CryptoKey> => getCryptoKeys().then((cryptoKeys) => cryptoKeys.rsaOAEP.privateKey);

export const getRSAPSSPublicKey = (
): Promise<CryptoKey> => getCryptoKeys().then((cryptoKeys) => cryptoKeys.rsaPSS.publicKey);

export const getRSAPSSPrivateKey = (
): Promise<CryptoKey> => getCryptoKeys().then((cryptoKeys) => cryptoKeys.rsaPSS.privateKey);
