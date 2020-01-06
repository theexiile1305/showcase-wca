import { SharedPublicKey } from './SharedPublicKey';

export interface SharedPublicKeys {
  userID: string;
  rsaOAEP: SharedPublicKey;
  rsaPSS: SharedPublicKey;
}
