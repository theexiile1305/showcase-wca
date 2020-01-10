const arrayBufferToString = (
  data: ArrayBuffer,
): string => String.fromCharCode.apply(null, Array.from(new Uint8Array(data)));

export const rawStringToArrayBuffer = (
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

export const stringToArrayBuffer = (
  string: string,
): ArrayBuffer => rawStringToArrayBuffer(window.atob(string));

export const arrayBufferToBase64 = (
  arrayBuffer: ArrayBuffer,
): string => window.btoa(arrayBufferToString(arrayBuffer));
