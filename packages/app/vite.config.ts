import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '/',
  build: {
    target: ['es2020'],
    outDir: process.env.BUILD_PATH || 'dist',
  },
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
});
