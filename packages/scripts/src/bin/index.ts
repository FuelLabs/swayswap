import { Commands } from '../types';
import type { Config } from '../types';

const { Command } = require('commander');

const { buildContracts } = require('../actions/buildContracts.js');
const { deployContracts } = require('../actions/deployContracts.js');
const { runAll } = require('../actions/runAll.js');
const { loadConfig } = require('../helpers/loader.js');

const program = new Command('swayswap');

function action(command: string, func: (config: Config) => Promise<unknown>) {
  return async () => {
    const config = await loadConfig(process.cwd());
    try {
      const result: unknown = await func(config);
      // @ts-ignore
      config.onSuccess?.({
        type: command as Commands,
        data: result,
      } as Event);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error((err as Error).message);
      config.onFailure?.(err);
      process.exit();
    }
  };
}

program
  .name('SwaySwap Scripts')
  .description('Utility to build, deploy and generate types for Sway Contracts')
  .command(Commands.build)
  .description('Build sway contracts and generate type')
  .action(action(Commands.build, async (config) => buildContracts(config)))
  .command(Commands.deploy)
  .description('deploy contract to fuel network')
  .action(action(Commands.deploy, (config) => deployContracts(config)))
  .command(Commands.run)
  .description('build and deploy contracts to fuel network')
  .action(action(Commands.run, (config) => runAll(config)))
  .parse(process.argv);
