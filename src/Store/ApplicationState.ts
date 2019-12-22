import { UIStore } from './ui/UIStore';
import { UserStore } from './user/UserStore';

export interface ApplicationState {
  ui: UIStore;
  user: UserStore;
}
