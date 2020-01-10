import { Action, ActionCreator } from 'redux';

export enum UserAction {
  SAVE_USER = '@@wca/SAVE_USER',
  LOGOUT_USER = '@@wca/LOGOUT_USER'
}

export interface StoreUserAction extends Action {
  type: UserAction.SAVE_USER;
  uid: string | null;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export interface LogoutUserAction extends Action {
  type: UserAction.LOGOUT_USER;
}

export type UserActions =
  | StoreUserAction
  | LogoutUserAction;

export const storeUser: ActionCreator<StoreUserAction> = (
  user: firebase.User,
) => {
  if (user) {
    return {
      type: UserAction.SAVE_USER,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    };
  }
  return {
    type: UserAction.SAVE_USER,
    uid: null,
    email: null,
    displayName: null,
    emailVerified: false,
  };
};
export const logoutUser: ActionCreator<LogoutUserAction> = (
) => ({
  type: UserAction.LOGOUT_USER,
});
