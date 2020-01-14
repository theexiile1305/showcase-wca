import { Action, ActionCreator } from 'redux';

export enum DebugAction {
  SAVE_AES_CBC = '@@wca/SAVE_AES_CBC',
  REMOVE_DEBUG = '@@wca/REMOVE_DEBUG'
}

export interface SaveAESCBCAction extends Action {
  type: DebugAction.SAVE_AES_CBC;
  iv: string;
}

export interface RemoveDebugAction extends Action {
  type: DebugAction.REMOVE_DEBUG;
}

export type DebugActions =
  | SaveAESCBCAction
  | RemoveDebugAction;

export const saveAESCBC: ActionCreator<SaveAESCBCAction> = (
  iv: string,
) => ({
  type: DebugAction.SAVE_AES_CBC,
  iv,
});

export const removeDebug: ActionCreator<RemoveDebugAction> = (
) => ({
  type: DebugAction.REMOVE_DEBUG,
});
