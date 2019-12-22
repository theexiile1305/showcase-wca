import { Action, ActionCreator } from 'redux';
import { Snackbar } from 'src/Models/Notification';

export enum UIAction {
  LOADING_UI = '@@wca/LOADING_UI',
  STOP_LOADING_UI = '@@wca/STOP_LOADING_UI',
  OPEN_SNACKBAR = '@@wca/ENQUEUE_SNACKBAR',
  CLOSE_SNACKBAR = '@@wca/CLOSE_SNACKBAR',
}

export interface SetUILoadingAction extends Action {
  type: UIAction.LOADING_UI;
}

export interface SetUIStopLoadingAction extends Action {
  type: UIAction.STOP_LOADING_UI;
}

export interface OpenSnackbarAction extends Action {
  type: UIAction.OPEN_SNACKBAR;
  snackbar: Snackbar;
}

export interface CloseSnackbarAction extends Action {
  type: UIAction.CLOSE_SNACKBAR;
}

export type UIActions =
  | SetUILoadingAction
  | SetUIStopLoadingAction
  | OpenSnackbarAction
  | CloseSnackbarAction;

export const setUILoading: ActionCreator<SetUILoadingAction> = () => ({
  type: UIAction.LOADING_UI,
});

export const clearUILoading: ActionCreator<SetUIStopLoadingAction> = () => ({
  type: UIAction.STOP_LOADING_UI,
});

export const openSnackbar: ActionCreator<OpenSnackbarAction> = (message: string) => ({
  type: UIAction.OPEN_SNACKBAR,
  snackbar: { message },
});

export const closeSnackbar: ActionCreator<CloseSnackbarAction> = () => ({
  type: UIAction.CLOSE_SNACKBAR,
});
