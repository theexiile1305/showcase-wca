import { UIStore } from './ui/UIStore';
import { UserStore } from './user/UserStore';
import { DocumentStore } from './documents/DocumentStore';
import { CryptoStore } from './crypto/CryptoStore';
import { DebugStore } from './debug/DebugStore';

export interface ApplicationState {
  ui: UIStore;
  user: UserStore;
  documents: DocumentStore;
  crypto: CryptoStore;
  debug: DebugStore;
}
