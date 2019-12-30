import { KeyStorage } from 'src/Models/KeyStorage';
import store from './config';

const KEY_STORAGE = 'keyStorage';

export const saveKeyStorage = (
  keyStorage: KeyStorage,
): Promise<KeyStorage> => store.setItem(KEY_STORAGE, keyStorage);

export const getKeyStorage = (
): Promise<KeyStorage> => store.getItem(KEY_STORAGE);

export const removeKeyStorage = (
): Promise<void> => store.removeItem(KEY_STORAGE);
