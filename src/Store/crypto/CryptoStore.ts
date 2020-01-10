export interface CryptoStore {
  saltPasswordHash: string | null;
  passwordKey: {
    salt: string;
    key: CryptoKey;
  } | null;
  rsaOAEP: {
    iv: string;
    privateKey: CryptoKey;
    publicKey: CryptoKey;
  } | null;
  rsaPSS: {
    iv: string;
    privateKey: CryptoKey;
    publicKey: CryptoKey;
  } | null;
  dataNameKey: {
    iv: string;
    key: CryptoKey;
  } | null;
}
