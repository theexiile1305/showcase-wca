/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardActions, CardContent, Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import 'src/Assets/App.css';
import savePEM from 'src/Api/savePEM';
import { ApplicationState } from 'src/Store/ApplicationState';
import { exportToPublicPEM, createFingerprint, exportToPrivatePEM } from 'src/Api/wca';
import { addPublicHeaderFooter, addPrivateHeaderFooter } from 'src/Api/wca/pemManagement';

const RSAPSS: React.FC = () => {
  const rsaPSS = useSelector((state: ApplicationState) => state.crypto.rsaPSS);

  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [fingerprintPublicKey, setFingerprintPublicKey] = useState('');
  const [fingerprintPrivateKey, setFingerprintPrivateKey] = useState('');

  const exportPublicPEM = async (key: CryptoKey): Promise<void> => exportToPublicPEM(key)
    .then((pem) => {
      setPublicKey(addPublicHeaderFooter(pem));
      return pem;
    })
    .then((pem) => createFingerprint(pem))
    .then((fingerprint) => setFingerprintPublicKey(fingerprint));

  const exportPrivatePEM = async (key: CryptoKey): Promise<void> => exportToPrivatePEM(key)
    .then((pem) => {
      setPrivateKey(addPrivateHeaderFooter(pem));
      return pem;
    })
    .then((pem) => createFingerprint(pem))
    .then((fingerprint) => setFingerprintPrivateKey(fingerprint));

  useEffect(() => {
    if (rsaPSS) {
      exportPublicPEM(rsaPSS.publicKey);
      exportPrivatePEM(rsaPSS.privateKey);
    }
  }, [rsaPSS]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color="primary">
            Key Details of RSA-PSS
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
            onClick={(): void => savePEM(publicKey, 'publicKey')}
          >
            Export Public Key
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={(): void => savePEM(privateKey, 'privateKey')}
          >
            Export Private Key
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default RSAPSS;
