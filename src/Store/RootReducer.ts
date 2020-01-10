import { combineReducers } from 'redux';
import { ApplicationState } from './ApplicationState';
import UIReducer from './ui/UIReducer';
import UserReducer from './user/UserReducer';
import DocumentReducer from './documents/DocumentReducer';
import CryptoReducer from './crypto/CryptoReducer';

const RootReducer = combineReducers<ApplicationState>({
  ui: UIReducer,
  user: UserReducer,
  documents: DocumentReducer,
  crypto: CryptoReducer,
});

export default RootReducer;
