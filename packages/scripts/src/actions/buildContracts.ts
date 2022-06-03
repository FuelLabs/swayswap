/* eslint-disable no-restricted-syntax */

import type { Config } from 'src/types';

import { buildContract } from './buildContract';

export async function buildContracts(config: Config) {
  for (const { path } of config.contracts) {
    await buildContract(path);
  }
}
