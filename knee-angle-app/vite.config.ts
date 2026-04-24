import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mkcert from 'vite-plugin-mkcert';

// getUserMedia and DeviceOrientation require HTTPS on mobile browsers.
// mkcert issues a local cert so `npm run dev -- --host` works over LAN.
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    host: true,
    https: true,
  },
  base: './',
});
