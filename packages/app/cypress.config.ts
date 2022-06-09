import './load.envs';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'packages/app/cypress/support/e2e.ts',
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
