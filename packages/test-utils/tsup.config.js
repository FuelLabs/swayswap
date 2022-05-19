import { defineConfig } from 'tsup';
import baseConfig from '@fuels-ui/config/tsup';

export default defineConfig((options) => ({
  ...baseConfig(options),
  external: ['react'],
  entry: ['src/index.ts'],
}));
