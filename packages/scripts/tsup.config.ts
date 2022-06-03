import { defineConfig } from 'tsup';

export default defineConfig((options) => [
  {
    entry: ['src/bin/index.ts'],
    dts: true,
    clean: true,
    format: ['cjs'],
    minify: !options.watch,
  },
]);
