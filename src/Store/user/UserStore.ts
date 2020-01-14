export interface UserStore {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}
