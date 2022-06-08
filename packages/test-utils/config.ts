import type { Config } from '@jest/types';

export const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist'],
  reporters: ['default', 'github-actions'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['@swayswap/test-utils/setup.ts'],
  collectCoverageFrom: [
    '<rootDir>/**/*.{js,ts,tsx}',
    '!**/*test.{js,ts,tsx}',
    '!**/test-*.{js,ts}',
  ],
  moduleNameMapper: {
    '.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub',
    '~/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
