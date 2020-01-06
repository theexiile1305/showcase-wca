export const encode = (
  text: string,
): ArrayBuffer => new TextEncoder().encode(text);

export const decode = (
  data: ArrayBuffer,
): string => new TextDecoder('utf-8').decode(new Uint8Array(data));

export const arrayBufferToString = (
  data: ArrayBuffer,
): string => String.fromCharCode.apply(null, Array.from(new Uint8Array(data)));

export const stringToArrayBuffer = (
  text: string,
): ArrayBuffer => {
  const { length } = text;
  const buffer = new ArrayBuffer(length);
  const bufferView = new Uint8Array(buffer);
  for (let i = 0; i < length; i += 1) {
    bufferView[i] = text.charCodeAt(i);
  }
  return buffer;
};
