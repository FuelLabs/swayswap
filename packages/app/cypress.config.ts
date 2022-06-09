import './load.envs';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.VITE_APP_URL,
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
