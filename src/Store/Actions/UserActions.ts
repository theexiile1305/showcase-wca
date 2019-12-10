import { Action } from 'redux';

export enum UserAction {
  AUTHENTICATED = 'AUTHENTICATED',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED'
}

export interface AuthenticationAction extends Action {
  type: UserAction.AUTHENTICATED;
}

export interface NotAuthenticationAction extends Action {
  type: UserAction.NOT_AUTHENTICATED;
}

export type UserActions =
  | AuthenticationAction
  | NotAuthenticationAction;
