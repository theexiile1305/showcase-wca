export const wca = window.crypto.subtle;

export const PBKDF2_DERIVE_PASSWORD_HASH_ALGORITHM = (
  salt: ArrayBuffer,
): Pbkdf2Params => ({
  name: 'PBKDF2',
  salt,
  iterations: 100000,
  hash: 'SHA-512',
});

export const PBKDF2_DERIVE_PASSWORD_KEY_ALGORITHM = (
  salt: ArrayBuffer,
): Pbkdf2Params => ({
  name: 'PBKDF2',
  salt,
  iterations: 200000,
  hash: 'SHA-512',
});

export const AES_CBC_PASSWORD_KEY_GEN_ALGORITHM = (
): AesKeyGenParams => ({
  name: 'AES-CBC',
  length: 256,
});

export const AES_CBC_PASSWORD_KEY_ALGORITHM = (
  iv: ArrayBuffer,
): AesCbcParams => ({
  name: 'AES-CBC',
  iv,
});

export const RSA_OAEP_GEN_ALGORITHM = (
): RsaHashedKeyGenParams => ({
  name: 'RSA-OAEP',
  modulusLength: 4096,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: 'SHA-512',
});

export const RSA_OAEP_IMPORT_ALGORITHM = (
): RsaHashedImportParams => ({
  name: 'RSA-OAEP',
  hash: 'SHA-512',
});

export const RSA_OAEP_ALGORITHM = (
): RsaOaepParams => ({
  name: 'RSA-OAEP',
});

export const RSA_PSS_GEN_ALGORITHM = (
): RsaHashedKeyGenParams => ({
  name: 'RSA-PSS',
  modulusLength: 4096,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: 'SHA-512',
});

export const RSA_PSS_IMPORT_ALGORITHM = (
): RsaHashedImportParams => ({
  name: 'RSA-PSS',
  hash: 'SHA-512',
});

export const RSA_PSS_ALGORITHM = (
): RsaPssParams => ({
  name: 'RSA-PSS',
  saltLength: 0,
});

export const FINGERPRINT_ALGORITHM = 'SHA-512';
