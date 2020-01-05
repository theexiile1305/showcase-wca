import { Reducer, AnyAction } from 'redux';
import { Document } from 'src/Models/Document';
import { DocumentStore } from './DocumentStore';
import { DocumentAction } from './DocumentActions';

const initialState: DocumentStore = {
  documents: [],
};

const addUniqueDocument = (
  documents: Document[], document: Document,
): Document[] => {
  const updated = documents.filter((item) => item.filename !== document.filename);
  return [...updated, document];
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
    default:
      return state;
  }
};

export default DocumentReducer;
