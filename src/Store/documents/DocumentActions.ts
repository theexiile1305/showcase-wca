import { Action, ActionCreator } from 'redux';
import { Document } from 'src/Models/Document';

export enum DocumentAction {
  SAVE_DOCUMENTS = '@@wca/SAVE_DOCUMENTS',
  REMOVE_DOCUMENT = '@@wca/REMOVE_DOCUMENT'
}

export interface SaveDocumentAction extends Action {
  type: DocumentAction.SAVE_DOCUMENTS;
  documents: Document[];
}
export interface RemoveDocumentAction extends Action {
  type: DocumentAction.REMOVE_DOCUMENT;
  id: string;
}

export type DocumentActions =
  | SaveDocumentAction
  | RemoveDocumentAction;

export const saveDocuments: ActionCreator<SaveDocumentAction> = (documents: Document[]) => ({
  type: DocumentAction.SAVE_DOCUMENTS,
  documents,
});

export const removeDocument: ActionCreator<RemoveDocumentAction> = (id: string) => ({
  type: DocumentAction.REMOVE_DOCUMENT,
  id,
});
