// import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    server: {
        host: true,
        // https: {
        //     key: fs.readFileSync('src/ssl/my_private_key.pem'),
        //     cert: fs.readFileSync('src/ssl/my_signed_certificate.pem'),
        //     ca: fs.readFileSync('src/ssl/my_root_certificate.pem'),
        // },
    },
    base: './',
});
