import { UIStore } from './ui/UIStore';
import { UserStore } from './user/UserStore';
import { DocumentStore } from './documents/DocumentStore';
import { DebugStore } from './debug/DebugStore';
import { PKIStore } from './pki/PKIStore';

export interface ApplicationState {
  ui: UIStore;
  user: UserStore;
  documents: DocumentStore;
  debug: DebugStore;
  pki: PKIStore;
}
