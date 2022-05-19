import type { Config } from '@jest/types';

export const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  reporters: ['default', 'github-actions'],
  setupFilesAfterEnv: ['@fuels-ui/test-utils/setup.ts'],
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: true,
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  collectCoverageFrom: [
    '<rootDir>/**/*.{js,ts,tsx}',
    '!**/*test.{js,ts,tsx}',
    '!**/test-*.{js,ts}',
  ],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
