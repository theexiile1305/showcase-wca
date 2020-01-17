import { Document } from 'src/Models/Document';

export interface DocumentStore {
  documents: Document[];
  selected: string | null;
  url: string | null;
}
