import { createInstance, INDEXEDDB } from 'localforage';

const store = createInstance({
  driver: INDEXEDDB,
  name: 'keyStorage',
  version: 1.0,
  size: 4980736,
  storeName: 'key_storage',
  description: 'storage for keys',
});

export default store;
