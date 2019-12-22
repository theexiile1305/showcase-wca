import { MUser } from '../../Models/MUser';

export interface UserStore {
  isAuthenticated: boolean;
  user: MUser | null;
}
