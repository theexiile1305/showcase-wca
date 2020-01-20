const saveASC = (
  pem: string, fileName: string,
): void => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  const blob = new Blob([pem], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = `${fileName}.asc`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default saveASC;
