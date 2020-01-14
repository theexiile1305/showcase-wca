import { Action, ActionCreator } from 'redux';
import { Document } from 'src/Models/Document';

export enum DocumentAction {
  STORE_DOCUMENT = '@@wca/STORE_DOCUMENT',
  REMOVE_DOCUMENT = '@@wca/REMOVE_DOCUMENT',
  REMOVE_DOCUMENTS = '@@wca/REMOVE_DOCUMENTS',
  ADD_SELECTED = '@@wca/ADD_SELECTED',
  REMOVE_SELECTED = '@@wca/REMOVE_SELECTED'
}

export interface StoreDocumentAction extends Action {
  type: DocumentAction.STORE_DOCUMENT;
  document: Document;
}

export interface RemoveDocumentAction extends Action {
  type: DocumentAction.REMOVE_DOCUMENT;
  id: string;
}

export interface RemoveDocumentsAction extends Action {
  type: DocumentAction.REMOVE_DOCUMENTS;
}
export type DocumentActions =
  | StoreDocumentAction
  | RemoveDocumentAction
  | RemoveDocumentsAction;

export const storeDocument: ActionCreator<StoreDocumentAction> = (
  id: string, filename: string, path: string, fingerprint: string, shared: boolean,
) => ({
  type: DocumentAction.STORE_DOCUMENT,
  document: {
    id,
    filename,
    path,
    fingerprint,
    shared,
  },
});

export const removeDocument: ActionCreator<RemoveDocumentAction> = (
  id: string,
) => ({
  type: DocumentAction.REMOVE_DOCUMENT,
  id,
});

export const removeDocuments: ActionCreator<RemoveDocumentsAction> = (
) => ({
  type: DocumentAction.REMOVE_DOCUMENTS,
});
