import { bn, Wallet } from 'fuels';

import '../../load.envs';
import './loadDockerEnv';
import { ExchangeContractAbi__factory, TokenContractAbi__factory } from '../../src/types/contracts';

import { initializePool } from './initializePool';
import { initializeTokenContract } from './initializeTokenContract';

const { WALLET_SECRET, PROVIDER_URL, GAS_PRICE, VITE_CONTRACT_ID, VITE_TOKEN_ID1, VITE_TOKEN_ID2 } =
  process.env;

if (!WALLET_SECRET) {
  process.stdout.write('WALLET_SECRET is not detected!\n');
  process.exit(1);
}

async function main() {
  let wallet;
  if (WALLET_SECRET && WALLET_SECRET.indexOf(' ') >= 0) {
    wallet = Wallet.fromMnemonic(WALLET_SECRET, PROVIDER_URL);
  } else {
    wallet = Wallet.fromPrivateKey(WALLET_SECRET!, PROVIDER_URL);
  }
  const exchangeContract = ExchangeContractAbi__factory.connect(VITE_CONTRACT_ID!, wallet);
  const tokenContract1 = TokenContractAbi__factory.connect(VITE_TOKEN_ID1!, wallet);
  const tokenContract2 = TokenContractAbi__factory.connect(VITE_TOKEN_ID2!, wallet);
  const overrides = {
    gasPrice: bn(GAS_PRICE || 0),
  };

  await initializeTokenContract(tokenContract1, overrides);
  await initializeTokenContract(tokenContract2, overrides);
  if (process.argv.includes('--init-pool')) {
    await initializePool(tokenContract1, tokenContract2, exchangeContract, overrides);
  }
}

main();
