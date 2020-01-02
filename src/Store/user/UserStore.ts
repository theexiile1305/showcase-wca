import { MUser } from '../../Models/User';

export interface UserStore {
  user: MUser | null;
}
