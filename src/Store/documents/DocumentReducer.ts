import { Reducer, AnyAction } from 'redux';
import { Document } from 'src/Models/Document';
import { SharedPublicKeys } from 'src/Models/SharedPublicKeys';
import { DocumentStore } from './DocumentStore';
import { DocumentAction } from './DocumentActions';

const initialState: DocumentStore = {
  documents: [],
  sharedPublicKeys: [],
};

const addUniqueDocument = (
  array: Document[], element: Document,
): Document[] => {
  const updated = array.filter((item) => item.filename !== element.filename);
  return [...updated, element];
};

const addUniqueSharedPublicKeys = (
  array: SharedPublicKeys[], element: SharedPublicKeys,
): SharedPublicKeys[] => {
  const updated = array.filter((item) => item.userID !== element.userID);
  return [...updated, element];
};

const DocumentReducer: Reducer<DocumentStore> = (
  state: DocumentStore = initialState, action: AnyAction,
) => {
  switch (action.type) {
    case DocumentAction.SAVE_DOCUMENTS:
      return {
        ...state,
        documents: action.documents,
      };
    case DocumentAction.SAVE_SINGLE_DOCUMENT:
      return {
        ...state,
        documents: addUniqueDocument(state.documents, action.document).sort(),
      };
    case DocumentAction.REMOVE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter((item) => item.filename !== action.filename),
      };
    case DocumentAction.SAVE_SHARED_PUBLIC_KEYS:
      return {
        ...state,
        sharedPublicKeys: addUniqueSharedPublicKeys(state.sharedPublicKeys, action.sharedPublicKeys),
      };
    case DocumentAction.REMOVE_SHARED_PUBLIC_KEYS:
      return {
        ...state,
        sharedPublicKeys: state.sharedPublicKeys.filter((item) => item.userID !== action.userID),
      };
    default:
      return state;
  }
};

export default DocumentReducer;
