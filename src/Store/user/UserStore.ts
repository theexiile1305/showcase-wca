import { MUser } from '../../Models/MUser';

export interface UserStore {
  user: MUser | null;
}
