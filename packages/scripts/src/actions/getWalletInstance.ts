import { WalletManager } from '@fuel-ts/wallet-manager';
import { Wallet } from 'fuels';
import { log } from 'src/log';

export async function getWalletInstance() {
  // Avoid early load of process env
  const { WALLET_SECRET, GENESIS_SECRET, PROVIDER_URL } = process.env;

  if (WALLET_SECRET) {
    log('WALLET_SECRET detected');
    if (WALLET_SECRET && WALLET_SECRET.indexOf(' ') >= 0) {
      const walletManager = new WalletManager();
      const password = '0b540281-f87b-49ca-be37-2264c7f260f7';

      await walletManager.unlock(password);
      const config = { type: 'mnemonic', secret: WALLET_SECRET };
      // Add a vault of type mnemonic
      await walletManager.addVault(config);
      await walletManager.addAccount();
      const accounts = walletManager.getAccounts();

      const wallet = walletManager.getWallet(accounts[0].address);
      wallet.connect(PROVIDER_URL!);
      return wallet;
    }

    return Wallet.fromPrivateKey(WALLET_SECRET!, PROVIDER_URL);
  }
  // If no WALLET_SECRET is informed we assume
  // We are on a test environment
  // In this case it must provide a GENESIS_SECRET
  // on this case the origen of balances should be
  // almost limitless assuming the genesis has enough
  // balances configured
  if (GENESIS_SECRET) {
    log('Funding wallet with some coins');
    return Wallet.generate();
  }
  throw new Error('You must provide a WALLET_SECRET or GENESIS_SECRET');
}
