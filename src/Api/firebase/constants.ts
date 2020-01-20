export const PKI = 'pki';

export const USERS = 'users';

export const DOCUMENTS = 'documents';

export const EXCHANGE = 'exchange';

export const RSA_OAEP_PEM = (
  userID: string,
): string => `/${PKI}/${userID}/rsaOAEP.pem`;

export const RSA_PSS_PEM = (
  userID: string,
): string => `/${PKI}/${userID}/rsaPSS.pem`;

export const USER_KEY_PEM = (
  userID: string, type: string,
): string => `/${USERS}/${userID}/${type}.pem`;

export const DOCUMENTS_DATA = (
  filename: string,
): string => `/${DOCUMENTS}/${filename}`;

export const getSaltPasswordHash = (
): string => 'F+PGJbx0sbInqLf2t+TIJS9wY1ZJphTvAsn/zi/dgRg=';
