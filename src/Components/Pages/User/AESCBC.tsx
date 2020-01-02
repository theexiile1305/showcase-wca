import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardActions, CardContent, Typography,
} from '@material-ui/core';
import { getKeyStorage } from 'src/Api/localforage';
import 'src/Assets/App.css';
import { exportSymmetricCryptoKey } from 'src/Api/wca/pemManagement';
import saveJsonWebKey from 'src/Api/saveJsonWebKey';

const AESCBC: React.FC = () => {
  const [jsonWebKey, setJsonWebKey] = useState();
  const [fingerprint, setFingerprint] = useState();

  useEffect(() => {
    getKeyStorage().then((keyStorage) => keyStorage.aesCBC)
      .then((aesCBC) => {
        setFingerprint(aesCBC.fingerprint);
        return exportSymmetricCryptoKey(aesCBC.key);
      })
      .then((key) => setJsonWebKey(key));
  }, []);

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color="primary">
            Key Details of AES-CBC
          </Typography>
          <Typography variant="body2">
            Fingerprint:
          </Typography>
          <pre className="codeBlock">
            <code>{fingerprint}</code>
          </pre>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={(): void => saveJsonWebKey(jsonWebKey)}
          >
            Export Key
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default AESCBC;
