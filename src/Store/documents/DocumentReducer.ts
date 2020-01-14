import { Reducer, AnyAction } from 'redux';
import { Document } from 'src/Models/Document';
import { DocumentStore } from './DocumentStore';
import { DocumentAction } from './DocumentActions';

const initialState: DocumentStore = {
  documents: [],
};

const addUniqueDocument = (
  array: Document[], element: Document,
): Document[] => {
  const updated = array
    .filter((item) => item !== null)
    .filter((item) => item.id !== element.id);
  return [...updated, element].sort();
};

const removeDocument = (
  array: Document[], id: string,
): Document[] => {
  const updated = array.filter((item) => item.id !== id);
  return updated.sort();
};

const DocumentReducer: Reducer<DocumentStore> = (
  state: DocumentStore = initialState, action: AnyAction,
) => {
  switch (action.type) {
    case DocumentAction.STORE_DOCUMENT:
      return {
        ...state,
        documents: addUniqueDocument(state.documents, action.document),
      };
    case DocumentAction.REMOVE_DOCUMENT:
      return {
        ...state,
        documents: removeDocument(state.documents, action.id),
      };
    case DocumentAction.REMOVE_DOCUMENTS:
      return {
        ...state,
        documents: [],
      };
    default:
      return state;
  }
};

export default DocumentReducer;
