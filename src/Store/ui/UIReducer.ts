import { Reducer } from 'redux';
import { UIStore } from './UIStore';
import { UIAction, UIActions } from './UIActions';

const initialState: UIStore = {
  loading: false,
  snackbar: null,
};

const UIReducer: Reducer<UIStore> = (state: UIStore = initialState, action: UIActions) => {
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
    default:
      return state;
  }
};

export default UIReducer;
