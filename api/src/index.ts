import app from './app';
import './database';
import https from 'https';
import fs from 'fs';

https.createServer({
    key: fs.readFileSync('ssl/my_private_key.pem'),  // Updated filename for the key
    cert: fs.readFileSync('ssl/my_signed_certificate.pem')  // Updated filename for the certificate
}, app).listen(8000, ()=>{
    console.log(`The server is listening on port 8000`);
});