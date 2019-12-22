import { combineReducers } from 'redux';
import { ApplicationState } from './ApplicationState';
import UIReducer from './ui/UIReducer';
import UserReducer from './user/UserReducer';

const RootReducer = combineReducers<ApplicationState>({
  ui: UIReducer,
  user: UserReducer,
});

export default RootReducer;
