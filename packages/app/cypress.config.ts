<<<<<<< HEAD
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {},
=======
import './load.envs';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
>>>>>>> 9e11472777e2090fb75480702c70ced546e25245
  viewportWidth: 1280,
  viewportHeight: 720,
});
