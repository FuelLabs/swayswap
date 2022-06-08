import type { Wallet } from 'fuels';

import { fetchFaucet } from '../useFaucet';

export async function faucet(wallet: Wallet, captcha?: string | null) {
  return fetchFaucet({
    method: 'POST',
    body: JSON.stringify({
      address: wallet?.address,
      captcha: captcha || '',
    }),
  });
}
