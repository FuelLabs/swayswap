import { randomBytes } from 'crypto';
import dotenv from 'dotenv';
import { createConfig, replaceEventOnEnv } from 'swayswap-scripts';

const { NODE_ENV, OUTPUT_ENV } = process.env;

function getEnvName() {
  return NODE_ENV === 'test' ? '.env.test' : '.env';
}

dotenv.config({
  path: `./docker/${getEnvName()}`,
});

const getDeployOptions = () => ({
  gasPrice: Number(process.env.GAS_PRICE || 0),
});

export default createConfig({
  types: {
    artifacts: './packages/contracts/**/out/debug/**-abi.json',
    output: './packages/app/src/types/contracts',
  },
  contracts: [
    {
      name: 'VITE_TOKEN_ID1',
      path: './packages/contracts/token_contract',
      options: () => {
        return {
          ...getDeployOptions(),
          salt: randomBytes(32),
        };
      },
    },
    {
      name: 'VITE_TOKEN_ID2',
      path: './packages/contracts/token_contract',
      options: () => {
        return {
          ...getDeployOptions(),
          salt: randomBytes(32),
        };
      },
    },
    {
      name: 'VITE_CONTRACT_ID',
      path: './packages/contracts/exchange_contract',
      options: (contracts) => {
        const deployedTokenContract1 = contracts.find((c) => c.name === 'VITE_TOKEN_ID1')!;
        const deployedTokenContract2 = contracts.find((c) => c.name === 'VITE_TOKEN_ID2')!;
        return {
          ...getDeployOptions(),
          storageSlots: [
            {
              key: '0x0000000000000000000000000000000000000000000000000000000000000001',
              value: deployedTokenContract1.contractId,
            },
            {
              key: '0x0000000000000000000000000000000000000000000000000000000000000002',
              value: deployedTokenContract2.contractId,
            },
          ],
        };
      },
    },
  ],
  onSuccess: (event) => {
    replaceEventOnEnv(`./packages/app/${OUTPUT_ENV || getEnvName()}`, event);
  },
});
