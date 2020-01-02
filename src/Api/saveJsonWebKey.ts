const saveJsonWebKey = (jsonWebKey: JsonWebKey): void => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  const json = JSON.stringify(jsonWebKey);
  const blob = new Blob([json], { type: 'octet/stream ' });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'key.json';
  a.click();
  window.URL.revokeObjectURL(url);
};

export default saveJsonWebKey;
