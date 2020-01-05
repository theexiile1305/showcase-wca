import { Action, ActionCreator } from 'redux';
import { Document } from 'src/Models/Document';

export enum DocumentAction {
  SAVE_DOCUMENTS = '@@wca/SAVE_DOCUMENTS',
  SAVE_SINGLE_DOCUMENT = '@@wca/SAVE_SINGLE_DOCUMENT',
  REMOVE_DOCUMENT = '@@wca/REMOVE_DOCUMENT'
}

export interface SaveDocumentAction extends Action {
  type: DocumentAction.SAVE_DOCUMENTS;
  documents: Document[];
}

export interface SaveSingleDocumentAction extends Action {
  type: DocumentAction.SAVE_SINGLE_DOCUMENT;
  document: Document;
}
export interface RemoveDocumentAction extends Action {
  type: DocumentAction.REMOVE_DOCUMENT;
  filename: string;
}

export type DocumentActions =
  | SaveDocumentAction
  | SaveSingleDocumentAction
  | RemoveDocumentAction;

export const saveDocuments: ActionCreator<SaveDocumentAction> = (
  listResult: firebase.storage.ListResult,
) => {
  const documents = listResult.items.map((reference) => {
    const document: Document = { id: reference.fullPath, filename: reference.name };
    return document;
  });

  return {
    type: DocumentAction.SAVE_DOCUMENTS,
    documents,
  };
};

export const saveSingleDocument: ActionCreator<SaveSingleDocumentAction> = (
  filename: string, fullpath: string,
) => ({
  type: DocumentAction.SAVE_SINGLE_DOCUMENT,
  document: {
    id: fullpath,
    filename,
  },
});

export const removeDocument: ActionCreator<RemoveDocumentAction> = (filename: string) => ({
  type: DocumentAction.REMOVE_DOCUMENT,
  filename,
});
