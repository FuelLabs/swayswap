import type { WalletUnlocked } from '@fuel-ts/wallet';
import { WalletManager } from '@fuel-ts/wallet-manager';
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
  let wallet: WalletUnlocked;
  if (WALLET_SECRET && WALLET_SECRET.indexOf(' ') >= 0) {
    const walletManager = new WalletManager();
    const password = '0b540281-f87b-49ca-be37-2264c7f260f7';

    await walletManager.unlock(password);
    const config = { type: 'mnemonic', secret: WALLET_SECRET };
    // Add a vault of type mnemonic
    await walletManager.addVault(config);
    await walletManager.addAccount();
    const accounts = walletManager.getAccounts();
    wallet = walletManager.getWallet(accounts[0].address);
    wallet.connect(PROVIDER_URL!);
    return wallet;
  } else {
    wallet = Wallet.fromPrivateKey(WALLET_SECRET!, PROVIDER_URL);
  }
  const exchangeContract = ExchangeContractAbi__factory.connect(VITE_CONTRACT_ID!, wallet);
  const tokenContract1 = TokenContractAbi__factory.connect(VITE_TOKEN_ID1!, wallet);
  const tokenContract2 = TokenContractAbi__factory.connect(VITE_TOKEN_ID2!, wallet);
  const overrides = {
    gasPrice: bn(GAS_PRICE || 0),
  };

  await initializeTokenContract(tokenContract1, overrides, '1.0');
  await initializeTokenContract(tokenContract2, overrides, '1000.0');
  if (process.argv.includes('--init-pool')) {
    await initializePool(tokenContract1, tokenContract2, exchangeContract, overrides);
  }
}

main();
