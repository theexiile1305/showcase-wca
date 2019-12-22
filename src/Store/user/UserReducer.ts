import { Reducer } from 'redux';
import { UserStore } from './UserStore';
import { UserAction, UserActions } from './UserActions';

const initialState: UserStore = {
  isAuthenticated: false,
  user: null,
};

const UserReducer: Reducer<UserStore> = (state: UserStore = initialState, action: UserActions) => {
  switch (action.type) {
    case UserAction.SAVE_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
      };
    case UserAction.LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default UserReducer;
