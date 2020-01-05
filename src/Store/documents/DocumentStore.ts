import { Document } from 'src/Models/Document';
import { SharedPublicKeys } from 'src/Models/SharedPublicKeys';

export interface DocumentStore {
  documents: Document[];
  sharedPublicKeys: SharedPublicKeys[];
}
