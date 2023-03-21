import { generateTestWallet } from '@fuel-ts/wallet/test-utils';
import { Account, NativeAssetId, Provider, Wallet } from 'fuels';
import { log } from 'src/log';

export async function getWalletInstance() {
  // Avoid early load of process env
  const { WALLET_SECRET, GENESIS_SECRET, PROVIDER_URL } = process.env;

  console.log('provider', PROVIDER_URL);
  if (WALLET_SECRET) {
    log('WALLET_SECRET detected');
    let wallet;
    if (WALLET_SECRET && WALLET_SECRET.indexOf(' ') >= 0) {
      wallet = Wallet.fromMnemonic(WALLET_SECRET, PROVIDER_URL);
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
