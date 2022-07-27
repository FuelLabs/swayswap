import { Wallet } from 'fuels';

import '../../load.envs';
import './loadDockerEnv';
import { ExchangeContractAbi__factory, TokenContractAbi__factory } from '../../src/types/contracts';

import { initializePool } from './initializePool';
import { initializeTokenContract } from './initializeTokenContract';

const { WALLET_SECRET, PROVIDER_URL, BYTE_PRICE, GAS_PRICE, VITE_CONTRACT_ID, VITE_TOKEN_ID } =
  process.env;

if (!WALLET_SECRET) {
  process.stdout.write('WALLET_SECRET is not detected!\n');
  process.exit(1);
}

async function main() {
  const wallet = new Wallet(WALLET_SECRET!, PROVIDER_URL);
  const exchangeContract = ExchangeContractAbi__factory.connect(VITE_CONTRACT_ID!, wallet);
  const tokenContract = TokenContractAbi__factory.connect(VITE_TOKEN_ID!, wallet);
  const overrides = {
    gasPrice: BigInt(GAS_PRICE || 0),
    bytePrice: BigInt(BYTE_PRICE || 0),
  };

  await initializeTokenContract(tokenContract, overrides);
  if (process.argv.includes('--init-pool')) {
    await initializePool(tokenContract, exchangeContract, overrides);
  }
}

main();
