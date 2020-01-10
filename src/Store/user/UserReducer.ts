import { Reducer } from 'redux';
import { UserStore } from './UserStore';
import { UserAction, UserActions } from './UserActions';

const initialState: UserStore = {
  uid: null,
  displayName: null,
  email: null,
  emailVerified: false,
};

const UserReducer: Reducer<UserStore> = (
  state: UserStore = initialState, action: UserActions,
) => {
  switch (action.type) {
    case UserAction.SAVE_USER:
      return {
        ...state,
        uid: action.uid,
        displayName: action.displayName,
        email: action.email,
        emailVerified: action.emailVerified,
      };
    case UserAction.LOGOUT_USER:
      return {
        ...state,
        uid: null,
        displayName: null,
        email: null,
        emailVerified: false,
      };
    default:
      return state;
  }
};

export default UserReducer;
