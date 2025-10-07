import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const basePort = Number(process.env.VITE_PORT) || 5467;

export default defineConfig({
  plugins: [react()],
  server: {
    port: basePort,
    strictPort: false, // falls Port belegt, sucht nächsten freien
    host: true
  }
});
