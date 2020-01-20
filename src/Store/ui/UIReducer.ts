import { Reducer } from 'redux';
import { UIStore } from './UIStore';
import { UIAction, UIActions, closeDialog } from './UIActions';

const initialState: UIStore = {
  loading: false,
  snackbar: null,
  dialog: null,
};

const UIReducer: Reducer<UIStore> = (
  state: UIStore = initialState, action: UIActions,
) => {
  switch (action.type) {
    case UIAction.LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case UIAction.STOP_LOADING_UI:
      return {
        ...state,
        loading: false,
      };
    case UIAction.OPEN_SNACKBAR:
      return {
        ...state,
        snackbar: action.snackbar,
      };
    case UIAction.CLOSE_SNACKBAR:
      return {
        ...state,
        snackbar: null,
      };
    case UIAction.OPEN_DIALOG:
      if (state.dialog) {
        closeDialog(state.dialog);
      }
      return {
        ...state,
        dialog: action.dialog,
      };
    case UIAction.CLOSE_DIALOG:
      return {
        ...state,
        dialog: null,
      };
    default:
      return state;
  }
};

export default UIReducer;
