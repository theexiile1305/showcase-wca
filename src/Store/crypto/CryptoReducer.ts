import { Reducer } from 'redux';
import { CryptoStore } from './CryptoStore';
import { CryptoAction, CryptoActions } from './CryptoActions';

const initialState: CryptoStore = {
  saltPasswordHash: null,
  passwordKey: null,
  rsaOAEP: null,
  rsaPSS: null,
  dataNameKey: null,
};

const CryptoReducer: Reducer<CryptoStore> = (
  state: CryptoStore = initialState, action: CryptoActions,
) => {
  switch (action.type) {
    case CryptoAction.STORE_SALT_PASSWORD_HASH:
      return {
        ...state,
        saltPasswordHash: action.salt,
      };
    case CryptoAction.STORE_PASSWORD_KEY:
      return {
        ...state,
        passwordKey: {
          salt: action.salt,
          key: action.key,
        },
      };
    case CryptoAction.STORE_RSA_OAEP:
      return {
        ...state,
        rsaOAEP: {
          iv: action.iv,
          privateKey: action.privateKey,
          publicKey: action.publicKey,
        },
      };
    case CryptoAction.STORE_RSA_PSS:
      return {
        ...state,
        rsaPSS: {
          iv: action.iv,
          privateKey: action.privateKey,
          publicKey: action.publicKey,
        },
      };
    case CryptoAction.STORE_DATA_NAME_KEY:
      return {
        ...state,
        dataNameKey: {
          iv: action.iv,
          key: action.key,
        },
      };
    case CryptoAction.REMOVE_CRYPTO_KEYS:
      return {
        ...state,
        saltPasswordHash: null,
        passwordKey: null,
        rsaOAEP: null,
        rsaPSS: null,
        dataNameKey: null,
      };
    default:
      return state;
  }
};

export default CryptoReducer;
