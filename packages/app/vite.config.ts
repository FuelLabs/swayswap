import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

config();

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '/',
  build: {
    target: ['es2020'],
    outDir: process.env.BUILD_PATH || 'dist',
  },
  plugins: [react(), tsconfigPaths()],
  define: {
    'process.env': process.env,
  },
});
