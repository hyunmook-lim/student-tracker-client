import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target:
          'https://fit-math-prod-java.eba-3ezakhau.ap-northeast-2.elasticbeanstalk.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
});
