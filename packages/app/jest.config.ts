/* eslint-disable import/no-extraneous-dependencies */
import type { Config } from '@jest/types';
import baseConfig from '@swayswap/test-utils/config';

import './load.envs.ts';
import pkg from './package.json';

const config: Config.InitialOptions = {
  ...baseConfig,
  rootDir: __dirname,
  displayName: pkg.name,
};

export default config;
