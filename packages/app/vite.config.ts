import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import './load.envs.ts';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
