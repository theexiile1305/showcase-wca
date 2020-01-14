import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import RootReducer from './RootReducer';

const persistConfig = {
  key: 'root',
  storage,
};

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

const initialState = {};
const middleware = [thunk];
const enhancer = composeEnhancers(applyMiddleware(...middleware));
const PersistedReducer = persistReducer(persistConfig, RootReducer);

export const store = createStore(PersistedReducer, initialState, enhancer);
export const persistor = persistStore(store);
