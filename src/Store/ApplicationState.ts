import { UIStore } from './ui/UIStore';
import { UserStore } from './user/UserStore';
import { DocumentStore } from './documents/DocumentStore';

export interface ApplicationState {
  ui: UIStore;
  user: UserStore;
  documents: DocumentStore;
}
