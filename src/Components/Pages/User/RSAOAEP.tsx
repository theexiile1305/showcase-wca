import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardActions, CardContent, Typography,
} from '@material-ui/core';
import { getKeyStorage } from 'src/Api/localforage';
import 'src/Assets/App.css';
import savePEM from 'src/Api/savePEM';
import { exportPublicCryptoKey, exportPrivateCryptoKey } from 'src/Api/wca/pemManagement';

const RSAOAEP: React.FC = () => {
  const [publicKey, setPublicKey] = useState();
  const [privateKey, setPrivateKey] = useState();
  const [fingerprintPublicKey, setFingerprintPublicKey] = useState('');
  const [fingerprintPrivateKey, setFingerprintPrivateKey] = useState('');

  useEffect(() => {
    getKeyStorage().then((keyStorage) => keyStorage.rsaOAEP)
      .then((rsaOAEP) => {
        setPublicKey(rsaOAEP.publicKey);
        setPrivateKey(rsaOAEP.privateKey);
        setFingerprintPublicKey(rsaOAEP.publicKeyFingerprint);
        setFingerprintPrivateKey(rsaOAEP.privateKeyFingerprint);
      });
  }, []);

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color="primary">
            Key Details of RSA-OAEP
          </Typography>
          <Typography variant="body2">
            Fingerprint (Public Key):
          </Typography>
          <pre className="codeBlock">
            <code>{fingerprintPublicKey}</code>
          </pre>
          <Typography variant="body2">
            Fingerprint (Private Key):
          </Typography>
          <pre className="codeBlock">
            <code>{fingerprintPrivateKey}</code>
          </pre>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={
              (): PromiseLike<void> => exportPublicCryptoKey(publicKey).then((key) => savePEM(key, 'publicKey'))
            }
          >
            Export Public Key
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={
              (): PromiseLike<void> => exportPrivateCryptoKey(privateKey).then((key) => savePEM(key, 'privateKey'))
            }
          >
            Export Private Key
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default RSAOAEP;
