import dotenv from 'dotenv';
import { createConfig, replaceEventOnEnv } from 'swayswap-scripts';

function getEnvName() {
  if (process.env.NODE_ENV === 'test') {
    return '.env.test';
  }
  return '.env';
}

dotenv.config({
  path: `./docker/${getEnvName()}`,
});

export default createConfig({
  types: {
    artifacts: './packages/contracts/**/out/debug/**.json',
    output: './packages/app/src/types/contracts',
  },
  contracts: [
    {
      name: 'VITE_CONTRACT_ID',
      path: './packages/contracts/exchange_contract',
    },
    {
      name: 'VITE_TOKEN_ID',
      path: './packages/contracts/token_contract',
    },
  ],
  onSuccess: (event) => {
    replaceEventOnEnv(`./packages/app/${getEnvName()}`, event);
  },
});
