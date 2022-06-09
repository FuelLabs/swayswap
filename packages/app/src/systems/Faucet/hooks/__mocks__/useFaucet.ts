import type { Wallet } from 'fuels';

import { fetchFaucet } from '../useFaucet';

import { sleep } from '~/systems/Core';

export async function faucet(wallet: Wallet, times = 2) {
  const range = Array.from({ length: times });
  await Promise.all(
    range.map(async (n, idx) => {
      await sleep(200 * idx);
      const res = await fetchFaucet({
        method: 'POST',
        body: JSON.stringify({
          address: wallet?.address,
          captcha: '',
        }),
      });
      return res;
    })
  );
}
