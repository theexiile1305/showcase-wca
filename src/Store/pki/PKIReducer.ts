import { Reducer } from 'redux';
import { PKIStore } from './PKIStore';
import { PKIAction, PKIActions } from './PKIActions';

const initialState: PKIStore = {
  emails: [],
};

const addUniquePKI = (
  array: string[], element: string,
): string[] => {
  const updated = array.filter((item) => item !== element);
  return [...updated, element];
};

const PKIReducer: Reducer<PKIStore> = (
  state: PKIStore = initialState, action: PKIActions,
) => {
  switch (action.type) {
    case PKIAction.SAVE_PKI:
      return {
        ...state,
        emails: addUniquePKI(state.emails, action.email),
      };
    case PKIAction.REMOVE_PKI:
      return {
        ...state,
        emails: [],
      };
    default:
      return state;
  }
};

export default PKIReducer;
