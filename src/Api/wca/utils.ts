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

export const base64StringToArrayBuffer = (
  string: string,
): ArrayBuffer => stringToArrayBuffer(window.atob(string));

export const arrayBufferToBase64 = (
  arrayBuffer: ArrayBuffer,
): string => window.btoa(arrayBufferToString(arrayBuffer));

export const blobToArrayBuffer = (
  data: Blob,
): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(data);
  reader.onerror = reject;
  reader.onload = (): void => resolve(reader.result as ArrayBuffer);
});

export const concatenate = (
  ...arrays: Uint8Array[]
): Uint8Array => Uint8Array.from(
  Array.prototype.concat(
    ...arrays.map((a) => Array.from(a)),
  ),
);
