import dotenv from 'dotenv';
import { Commands, createConfig } from 'swayswap-scripts';

dotenv.config({
  path: './docker/fuel-faucet/.env.docker',
});

export default createConfig({
  types: {
    artifacts: './packages/contracts/**/out/debug/**.json',
    output: './packages/app/src/types/contracts',
  },
  contracts: [
    {
      name: 'ExchangeContract',
      path: './packages/contracts/exchange_contract',
    },
    {
      name: 'TokenContract',
      path: './packages/contracts/token_contract',
    },
  ],
  onSuccess: (event) => {
    if (event.type === Commands.deploy || event.type === Commands.run) {
      console.log(event.data);
    }
  },
});
