import { Reducer, AnyAction } from 'redux';
import { DocumentStore } from './DocumentStore';
import { DocumentAction } from './DocumentActions';

const initialState: DocumentStore = {
  documents: [],
};

// TODO change AnyAction to DocumentsAction
const DocumentReducer: Reducer<DocumentStore> = (
  state: DocumentStore = initialState, action: AnyAction,
) => {
  switch (action.type) {
    case DocumentAction.SAVE_DOCUMENTS:
      return {
        ...state,
        documents: action.documents,
      };
    case DocumentAction.REMOVE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter((item) => item.id !== action.id),
      };
    default:
      return state;
  }
};

export default DocumentReducer;
