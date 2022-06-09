import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import './load.envs.ts';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const ENV_VARS = Object.entries(process.env).reduce((obj, [key, val]) => {
  if (key.startsWith('VITE_') || key === 'NODE_ENV') {
    return { ...obj, [key]: val };
  }
  return obj;
}, {});

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
  server: {
    port: process.env.NODE_ENV === 'test' ? 3001 : 3000,
  },
  define: {
    'process.env': ENV_VARS,
  },
});
