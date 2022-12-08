import type { Wallet } from 'fuels';

import { fetchFaucet } from '../useFaucet';

export async function faucet(wallet: Wallet, times = 2) {
  const range = Array.from({ length: times });
  await range.reduce(async (promise) => {
    await promise;
    return fetchFaucet({
      method: 'POST',
      body: JSON.stringify({
        address: wallet?.address.toAddress(),
        captcha: '',
      }),
    });
  }, Promise.resolve());
}
