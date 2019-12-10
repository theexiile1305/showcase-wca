import { Reducer } from 'redux';
import { UserStore } from '../UserStore';
import { UserActions, UserAction } from '../Actions/UserActions';

const initialState: UserStore = {
  isAuthenticated: false,
};

const userReducer: Reducer<UserStore> = (state: UserStore = initialState, action: UserActions) => {
  switch (action.type) {
    case UserAction.AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
      };
    case UserAction.NOT_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default userReducer;
