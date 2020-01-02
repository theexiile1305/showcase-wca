import { Action, ActionCreator } from 'redux';
import { MUser } from 'src/Models/User';

export enum UserAction {
  SAVE_USER = '@@wca/SAVE_USER',
  LOGOUT_USER = '@@wca/LOGOUT_USER'
}

export interface SaveUserAction extends Action {
  type: UserAction.SAVE_USER;
  user: MUser | null;
}

export interface LogoutUserAction extends Action {
  type: UserAction.LOGOUT_USER;
}

export type UserActions =
  | SaveUserAction
  | LogoutUserAction;

export const saveUserData: ActionCreator<SaveUserAction> = (user: firebase.User) => {
  let currentUser = null;
  if (user) {
    localStorage.setItem('isAuthenticated', 'true');
    currentUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    };
  }
  return {
    type: UserAction.SAVE_USER,
    user: currentUser,
  };
};

export const logoutUser: ActionCreator<LogoutUserAction> = () => {
  localStorage.setItem('isAuthenticated', 'false');
  return {
    type: UserAction.LOGOUT_USER,
  };
};
