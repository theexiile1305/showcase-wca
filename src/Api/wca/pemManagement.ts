const PEM_PUBLIC_HEADER = '-----BEGIN PUBLIC KEY BLOCK-----';
const PEM_PUBLIC_FOOTER = '-----END PUBLIC KEY BLOCK-----';
const PEM_PRIVATE_HEADER = '-----BEGIN PRIVATE KEY BLOCK-----';
const PEM_PRIVATE_FOOTER = '-----END PRIVATE KEY BLOCK-----';
const PEM_VERSION_HEADER = 'Version: WCAS';
const VERSION = process.env.REACT_APP_VERSION;

export const addPublicHeaderFooter = (
  publicKey: string,
): string => `${PEM_PUBLIC_HEADER}\n${PEM_VERSION_HEADER} ${VERSION}\n${publicKey}\n${PEM_PUBLIC_FOOTER}`;

export const addPrivateHeaderFooter = (
  privateKey: string,
): string => `${PEM_PRIVATE_HEADER}\n${PEM_VERSION_HEADER} ${VERSION}\n${privateKey}\n${PEM_PRIVATE_FOOTER}`;
