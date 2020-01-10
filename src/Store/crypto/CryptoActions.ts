import { Action, ActionCreator } from 'redux';

export enum CryptoAction {
  STORE_SALT_PASSWORD_HASH = '@@wca/STORE_SALT_PASSWORD_HASH',
  STORE_PASSWORD_KEY = '@@wca/STORE_PASSWORD_KEY',
  STORE_RSA_OAEP = '@@wca/STORE_RSA_OAEP',
  STORE_RSA_PSS = '@@wca/STORE_RSA_PSS',
  STORE_DATA_NAME_KEY = '@@wca/STORE_DATA_NAME_KEY',
  REMOVE_CRYPTO_KEYS = '@@wca/REMOVE_CRYPTO_KEYS'
}

export interface StoreSaltPasswordHashAction extends Action {
  type: CryptoAction.STORE_SALT_PASSWORD_HASH;
  salt: string;
}

export interface StorePasswordKeyAction extends Action {
  type: CryptoAction.STORE_PASSWORD_KEY;
  salt: string;
  key: CryptoKey;
}

export interface StoreRSAOAEPAction extends Action {
  type: CryptoAction.STORE_RSA_OAEP;
  iv: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}

export interface StoreRSAPSSAction extends Action {
  type: CryptoAction.STORE_RSA_PSS;
  iv: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}

export interface StoreDataNameKeyAction extends Action {
  type: CryptoAction.STORE_DATA_NAME_KEY;
  iv: string;
  key: CryptoKey;
}

export interface RemoveCryptoKeysAction extends Action {
  type: CryptoAction.REMOVE_CRYPTO_KEYS;
}

export type CryptoActions =
  | StoreSaltPasswordHashAction
  | StorePasswordKeyAction
  | StoreRSAOAEPAction
  | StoreRSAPSSAction
  | StoreDataNameKeyAction
  | RemoveCryptoKeysAction;

export const storeSaltPasswordHash: ActionCreator<StoreSaltPasswordHashAction> = (
  salt: string,
) => ({
  type: CryptoAction.STORE_SALT_PASSWORD_HASH,
  salt,
});

export const storePasswordKey: ActionCreator<StorePasswordKeyAction> = (
  salt: string, key: CryptoKey,
) => ({
  type: CryptoAction.STORE_PASSWORD_KEY,
  salt,
  key,
});

export const storeRSAOAEP: ActionCreator<StoreRSAOAEPAction> = (
  iv: string, privateKey: CryptoKey, publicKey: CryptoKey,
) => ({
  type: CryptoAction.STORE_RSA_OAEP,
  iv,
  privateKey,
  publicKey,
});

export const storeRSAPSS: ActionCreator<StoreRSAPSSAction> = (
  iv: string, privateKey: CryptoKey, publicKey: CryptoKey,
) => ({
  type: CryptoAction.STORE_RSA_PSS,
  iv,
  privateKey,
  publicKey,
});

export const storeDataNameKey: ActionCreator<StoreDataNameKeyAction> = (
  iv: string, key: CryptoKey,
) => ({
  type: CryptoAction.STORE_DATA_NAME_KEY,
  iv,
  key,
});

export const removeCryptoKeys: ActionCreator<RemoveCryptoKeysAction> = (
) => ({
  type: CryptoAction.REMOVE_CRYPTO_KEYS,
});
