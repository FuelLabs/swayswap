#!/usr/bin/env node

import { Command } from 'commander';
import { buildContracts } from 'src/actions/buildContracts.js';
import { deployContracts } from 'src/actions/deployContracts.js';
import { runAll } from 'src/actions/runAll.js';
import type { Config } from 'src/types';
import { Commands } from 'src/types';

import { loadConfig } from './loader.js';

const program = new Command();

function action(command: string, func: (config: Config) => Promise<unknown | void>) {
  return async () => {
    const config = await loadConfig(process.cwd());
    try {
      const result = await func(config);
      await config.onSuccess?.(command, result);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error((err as Error).message);
      await config.onFailure?.(command, err);
      process.exit();
    }
  };
}

program
  .name('SwaySwap Scripts')
  .description('Utility to build, deploy and generate types for Sway Contracts');

program
  .command(Commands.build)
  .description('Build sway contracts and generate type')
  .action(action(Commands.build, async (config) => buildContracts(config)));

program
  .command(Commands.deploy)
  .description('deploy contract to fuel network')
  .action(action(Commands.deploy, (config) => deployContracts(config)));

program
  .command(Commands.run)
  .description('build and deploy contracts to fuel network')
  .action(action(Commands.run, (config) => runAll(config)));

program.parse();
