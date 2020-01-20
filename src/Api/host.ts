const currentHost = window.location.port === ''
  ? `${window.location.protocol}//${window.location.hostname}`
  : `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

export default currentHost;
