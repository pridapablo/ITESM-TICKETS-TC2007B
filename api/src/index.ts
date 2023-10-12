import app from './app';
import https from 'https';
import fs from 'fs';
import path from 'path';

import './database';

https.createServer({
  cert: fs.readFileSync(path.join(__dirname, 'certs/backend.cer')), // Ruta al certificado (backend.cer)
  key: fs.readFileSync(path.join(__dirname, 'certs/backend.key'))     // Ruta a la clave privada (backend.key)
}, app).listen(8000, () => {
  console.log("Servidor escuchando en puerto 8000"); // Corregido el mensaje
    console.log(path.join(__dirname));
});
