import { combineReducers } from 'redux';
import { ApplicationState } from './ApplicationState';
import UIReducer from './ui/UIReducer';
import UserReducer from './user/UserReducer';
import DocumentReducer from './documents/DocumentReducer';

const RootReducer = combineReducers<ApplicationState>({
  ui: UIReducer,
  user: UserReducer,
  documents: DocumentReducer,
});

export default RootReducer;
