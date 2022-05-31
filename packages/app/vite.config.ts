import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

function getEnvName() {
  if (process.env.VERCEL_ENV === 'preview') {
    return '.env.preview';
  }
  if (process.env.NODE_ENV === 'production') {
    return '.env.production';
  }
  return '.env';
}

config({
  path: resolve(__dirname, getEnvName()),
});

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '/',
  build: {
    target: ['es2020'],
    outDir: process.env.BUILD_PATH || 'dist',
  },
  plugins: [
    react({
      babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] },
    }),
    tsconfigPaths(),
  ],
  define: {
    'process.env': process.env,
  },
});
