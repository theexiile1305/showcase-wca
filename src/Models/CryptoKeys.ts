export interface CryptoKeys {
  saltPasswordHash: string;
  passwordKey: {
    salt: string;
    key: CryptoKey;
  };
  rsaOAEP: {
    iv: string;
    privateKey: CryptoKey;
    publicKey: CryptoKey;
  };
  rsaPSS: {
    iv: string;
    privateKey: CryptoKey;
    publicKey: CryptoKey;
  };
  dataNameKey: {
    iv: string;
    key: CryptoKey;
  };
}
