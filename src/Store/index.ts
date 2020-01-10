import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import RootReducer from './RootReducer';

declare global {
  interface Window {
    // eslint-disable-next-line no-undef
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const persistConfig = {
  key: 'root',
  storage,
};

const initialState = {};
const middleware = [thunk];
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;
const enhancer = composeEnhancers(applyMiddleware(...middleware));
const PersistedReducer = persistReducer(persistConfig, RootReducer);

export const store = createStore(PersistedReducer, initialState, enhancer);
export const persistor = persistStore(store);
