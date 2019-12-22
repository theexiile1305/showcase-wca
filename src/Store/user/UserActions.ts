import { Action, ActionCreator } from 'redux';
import { MUser } from 'src/Models/MUser';

export enum UserAction {
  SAVE_USER = '@@wca/SAVE_USER',
  LOGOUT_USER = '@@wca/LOGOUT_USER'
}

export interface SaveUserAction extends Action {
  type: UserAction.SAVE_USER;
  user: MUser;
}

export interface LogoutUserAction extends Action {
  type: UserAction.LOGOUT_USER;
}

export type UserActions =
  | SaveUserAction
  | LogoutUserAction;

export const saveUserData: ActionCreator<SaveUserAction> = (user: firebase.User) => ({
  type: UserAction.SAVE_USER,
  user: {
    uid: user.uid,
    email: user.email,
  },
});

export const logoutUser: ActionCreator<LogoutUserAction> = () => ({
  type: UserAction.LOGOUT_USER,
});
