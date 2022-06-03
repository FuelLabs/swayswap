/* eslint-disable @typescript-eslint/no-explicit-any */

export enum Commands {
  'build' = 'build',
  'deploy' = 'deploy',
  'run' = 'run',
}

export type Config = {
  onSuccess?: (command: string, result: any) => void;
  onFailure?: (command: string, err: unknown) => void;
  env?: {
    [key: string]: string;
  };
  types: {
    artifacts: string;
    output: string;
  };
  contracts: {
    name: string;
    path: string;
  }[];
};
