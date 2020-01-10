import { Action, ActionCreator } from 'redux';

export enum DebugAction {
  SAVE_AES_CBC = '@@wca/SAVE_AES_CBC'
}

export interface SaveAESCBCAction extends Action {
  type: DebugAction.SAVE_AES_CBC;
  iv: string;
}

export type DebugActions =
  | SaveAESCBCAction;

export const saveAESCBC: ActionCreator<SaveAESCBCAction> = (
  iv: string,
) => ({
  type: DebugAction.SAVE_AES_CBC,
  iv,
});
