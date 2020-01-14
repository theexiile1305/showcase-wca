// keep
const savePEM = (pem: string, fileName: string): void => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  const blob = new Blob([pem], { type: 'application/x-pem-file ' });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = `${fileName}.pem`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default savePEM;
