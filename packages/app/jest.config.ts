import type { Config } from '@jest/types';

import baseConfig from '../../jest.config';

import './load.envs.ts';
import pkg from './package.json';

const configJest: Config.InitialOptions = {
  ...baseConfig,
  rootDir: __dirname,
  displayName: pkg.name,
};

export default configJest;
