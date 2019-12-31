export interface KeyStorage {
  rsaOAEP: {
    publicKey: CryptoKey;
    privateKey: CryptoKey;
    publicKeyFingerprint: string;
    privateKeyFingerprint: string;
  };
  rsaPSS: {
    publicKey: CryptoKey;
    privateKey: CryptoKey;
    publicKeyFingerprint: string;
    privateKeyFingerprint: string;
  };
  aesCBC: {
    key: CryptoKey;
    iv: Uint8Array;
    fingerprint: string;
  };
}
