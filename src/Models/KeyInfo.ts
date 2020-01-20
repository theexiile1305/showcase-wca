export interface KeyInfo {
  passwordKey: {
    salt: string;
  };
  rsaOAEP: {
    iv: string;
    privateKey: string;
  };
  rsaPSS: {
    iv: string;
    privateKey: string;
  };
  dataNameKey: {
    iv: string;
    key: string;
  };
}
