import { Action, ActionCreator } from 'redux';
import { Snackbar } from 'src/Models/Notification';
import DialogType from 'src/Models/DialogType';

export enum UIAction {
  LOADING_UI = '@@wca/LOADING_UI',
  STOP_LOADING_UI = '@@wca/STOP_LOADING_UI',
  OPEN_SNACKBAR = '@@wca/ENQUEUE_SNACKBAR',
  CLOSE_SNACKBAR = '@@wca/CLOSE_SNACKBAR',
  OPEN_DIALOG = '@@wca/OPEN_DIALOG',
  CLOSE_DIALOG = '@@wca/CLOSE_DIALOG'
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

export interface OpenDialogAction extends Action {
  type: UIAction.OPEN_DIALOG;
  dialog: DialogType;
}

export interface CloseDialogAction extends Action {
  type: UIAction.CLOSE_DIALOG;
  dialog: DialogType;
}

export type UIActions =
  | SetUILoadingAction
  | SetUIStopLoadingAction
  | OpenSnackbarAction
  | CloseSnackbarAction
  | OpenDialogAction
  | CloseDialogAction;

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

export const openDialog: ActionCreator<OpenDialogAction> = (dialog: DialogType) => ({
  type: UIAction.OPEN_DIALOG,
  dialog,
});

export const closeDialog: ActionCreator<CloseDialogAction> = (dialog: DialogType) => ({
  type: UIAction.CLOSE_DIALOG,
  dialog,
});
