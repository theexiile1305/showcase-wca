// keep
export const PKI = 'pki';
// keep
export const USERS = 'users';
// keep
export const DOCUMENTS = 'documents';
// keep
export const EXCHANGE = 'exchange';
// keep
export enum MIME_TYPES {
  X_PEM_FILE = 'application/x-pem-file'
}
// keep
export const RSA_OAEP_PEM = (userID: string): string => `/${PKI}/${userID}/rsaOAEP.pem`;
// keep
export const RSA_PSS_PEM = (userID: string): string => `/${PKI}/${userID}/rsaPSS.pem`;
// keep
export const USER_KEY_PEM = (userID: string, type: string): string => `/${USERS}/${userID}/${type}.pem`;
// keep
export const DOCUMENTS_DATA = (filename: string): string => `/${DOCUMENTS}/${filename}`;

// keep
export const getSaltPasswordHash = (): string => 'F+PGJbx0sbInqLf2t+TIJS9wY1ZJphTvAsn/zi/dgRg=';
