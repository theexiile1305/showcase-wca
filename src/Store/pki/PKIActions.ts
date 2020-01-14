import { Action, ActionCreator } from 'redux';

export enum PKIAction {
  SAVE_PKI = '@@wca/SAVE_PKI',
  REMOVE_PKI = '@@wca/REMOVE_PKI'
}

export interface SavePKIAction extends Action {
  type: PKIAction.SAVE_PKI;
  email: string;
}

export interface RemovePKIAction extends Action {
  type: PKIAction.REMOVE_PKI;
}

export type PKIActions =
  | SavePKIAction
  | RemovePKIAction;

export const savePKI: ActionCreator<SavePKIAction> = (
  email: string,
) => ({
  type: PKIAction.SAVE_PKI,
  email,
});

export const removePKI: ActionCreator<RemovePKIAction> = (
) => ({
  type: PKIAction.REMOVE_PKI,
});
