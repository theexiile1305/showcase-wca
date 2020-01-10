import { Action, ActionCreator } from 'redux';

export enum PKIAction {
  SAVE_PKI = '@@wca/SAVE_PKI'
}

export interface SavePKIAction extends Action {
  type: PKIAction.SAVE_PKI;
  email: string;
}

export type PKIActions =
  | SavePKIAction;

export const savePKI: ActionCreator<SavePKIAction> = (
  email: string,
) => ({
  type: PKIAction.SAVE_PKI,
  email,
});
