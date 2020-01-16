export const SIGNATURE_SIZE = 512;
export const AES_KEY_SIZE = 512;
export const USER_ID_SIZE = 28;
export const COUNTER_SIZE = 1;
export const SINGLE_AES_BLOCK_SIZE = USER_ID_SIZE + AES_KEY_SIZE;
export const IV_SIZE = 16;


export const COUNT_SIZE = (
  counterValue: number,
): number => counterValue + 1;


// signature block
export const BEGIN_SIGNATURE = (
  byteLength: number,
): number => byteLength - SIGNATURE_SIZE;

export const END_SIGNATURE = (
  byteLength: number,
): number => byteLength;


// signature userID block
export const BEGIN_SIGNATURE_USER_ID = (
  byteLength: number,
): number => BEGIN_SIGNATURE(byteLength) - USER_ID_SIZE;

export const END_SIGNATURE_USER_ID = (
  byteLength: number,
): number => BEGIN_SIGNATURE(byteLength);


// counter block
export const BEGIN_COUNTER = (
  byteLength: number,
): number => BEGIN_SIGNATURE_USER_ID(byteLength) - COUNTER_SIZE;
export const END_COUNTER = (
  byteLength: number,
): number => BEGIN_SIGNATURE_USER_ID(byteLength);


// aes keys block
export const BEGIN_AES_KEYS_BLOCK = (
  byteLength: number, counterValue: number,
): number => BEGIN_COUNTER(byteLength) - SINGLE_AES_BLOCK_SIZE * COUNT_SIZE(counterValue);

export const END_AES_KEYS_BLOCK = (
  byteLength: number,
): number => BEGIN_COUNTER(byteLength);


// userID block
export const BEGIN_USER_ID = (
  byteLength: number, index: number, counterValue: number,
): number => END_AES_KEYS_BLOCK(byteLength)
- SINGLE_AES_BLOCK_SIZE * (COUNT_SIZE(counterValue) - index);

export const END_USER_ID = (
  byteLength: number, index: number, counterValue: number,
): number => BEGIN_USER_ID(byteLength, index, counterValue) + USER_ID_SIZE;


// single aes key block
export const BEGIN_SINGLE_AES = (
  byteLength: number, index: number, counterValue: number,
): number => END_USER_ID(byteLength, index, counterValue);

export const END_SINGLE_AES = (
  byteLength: number, index: number, counterValue: number,
): number => END_USER_ID(byteLength, index, counterValue) + AES_KEY_SIZE;


// iv block
export const BEGIN_IV = (
  byteLength: number, counterValue: number,
): number => BEGIN_AES_KEYS_BLOCK(byteLength, counterValue) - IV_SIZE;

export const END_IV = (
  byteLength: number, counterValue: number,
): number => BEGIN_AES_KEYS_BLOCK(byteLength, counterValue);


// blob block
export const BEGIN_BLOB = (
): number => 0;

export const END_BLOB = (
  byteLength: number, counterValue: number,
): number => BEGIN_IV(byteLength, counterValue);
