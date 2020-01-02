export const wca = window.crypto.subtle;

export const AES_CBC_ALGORITHM = {
  name: 'AES-CBC',
  length: 256,
};

export const RSA_OAEP_ALGORITHM = {
  name: 'RSA-OAEP',
  modulusLength: 4096,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: 'SHA-512',
};

export const RSA_PSS_ALGORITHM = {
  name: 'RSA-PSS',
  modulusLength: 4096,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: 'SHA-512',
};
