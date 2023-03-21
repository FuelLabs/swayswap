import { generateTestWallet } from '@fuel-ts/wallet/test-utils';
import { WalletManager } from '@fuel-ts/wallet-manager';
import { Account, NativeAssetId, Provider, Wallet } from 'fuels';
import { log } from 'src/log';

export async function getWalletInstance() {
  // Avoid early load of process env
  const { WALLET_SECRET, GENESIS_SECRET, PROVIDER_URL } = process.env;

  if (WALLET_SECRET) {
    log('WALLET_SECRET detected');
    let wallet;
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
    } else {
      wallet = Wallet.fromPrivateKey(WALLET_SECRET!, PROVIDER_URL);
    }
    const provider = new Provider(PROVIDER_URL!);

    return new Account(wallet.address, provider);
  }
  // If no WALLET_SECRET is informed we assume
  // We are on a test environment
  // In this case it must provide a GENESIS_SECRET
  // on this case the origen of balances should be
  // almost limitless assuming the genesis has enough
  // balances configured
  if (GENESIS_SECRET) {
    log('Funding wallet with some coins');
    const provider = new Provider(PROVIDER_URL!);
    return generateTestWallet(provider, [[100_000_000, NativeAssetId]]);
  }
  throw new Error('You must provide a WALLET_SECRET or GENESIS_SECRET');
}
