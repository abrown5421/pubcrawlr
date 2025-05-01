import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015', 
    minify: 'esbuild', 
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    include: ['trianglify'],
    esbuildOptions: {
      target: 'es2015',
    },
  },
});