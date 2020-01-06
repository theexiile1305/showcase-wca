import { Action, ActionCreator } from 'redux';
import { Document } from 'src/Models/Document';
import { SharedPublicKeys } from 'src/Models/SharedPublicKeys';

export enum DocumentAction {
  SAVE_DOCUMENTS = '@@wca/SAVE_DOCUMENTS',
  SAVE_SINGLE_DOCUMENT = '@@wca/SAVE_SINGLE_DOCUMENT',
  REMOVE_DOCUMENT = '@@wca/REMOVE_DOCUMENT',
  SAVE_SHARED_PUBLIC_KEYS = '@@wca/SAVE_SHARED_PUBLIC_KEYS',
  REMOVE_SHARED_PUBLIC_KEYS = '@@wca/REMOVE_SHARED_PUBLIC_KEYS'
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

export interface SaveSharedPublicKeysAction extends Action {
  type: DocumentAction.SAVE_SHARED_PUBLIC_KEYS;
  sharedPublicKeys: SharedPublicKeys;
}

export interface RemoveSharedPublicKeysAction extends Action {
  type: DocumentAction.REMOVE_SHARED_PUBLIC_KEYS;
  userID: string;
}

export type DocumentActions =
  | SaveDocumentAction
  | SaveSingleDocumentAction
  | RemoveDocumentAction
  | SaveSharedPublicKeysAction
  | RemoveSharedPublicKeysAction;

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

export const saveSharedPublicKeys: ActionCreator<SaveSharedPublicKeysAction> = (
  sharedPublicKeys: SharedPublicKeys,
) => ({
  type: DocumentAction.SAVE_SHARED_PUBLIC_KEYS,
  sharedPublicKeys,
});

export const removeSharedPublicKeys: ActionCreator<RemoveSharedPublicKeysAction> = (
  userID: string,
) => ({
  type: DocumentAction.REMOVE_SHARED_PUBLIC_KEYS,
  userID,
});
