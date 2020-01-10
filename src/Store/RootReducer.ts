import { combineReducers } from 'redux';
import { ApplicationState } from './ApplicationState';
import UIReducer from './ui/UIReducer';
import UserReducer from './user/UserReducer';
import DocumentReducer from './documents/DocumentReducer';
import CryptoReducer from './crypto/CryptoReducer';
import DebugReducer from './debug/DebugReducer';
import PKIReducer from './pki/PKIReducer';

const RootReducer = combineReducers<ApplicationState>({
  ui: UIReducer,
  user: UserReducer,
  documents: DocumentReducer,
  crypto: CryptoReducer,
  debug: DebugReducer,
  pki: PKIReducer,
});

export default RootReducer;
