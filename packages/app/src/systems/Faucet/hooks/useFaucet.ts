import fetch from 'cross-fetch';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';

import { FUEL_FAUCET_URL } from '~/config';
import { useBalances, useWallet } from '~/systems/Core';
import { format, safeBigInt } from '~/systems/Core/utils/math';
import type { Maybe } from '~/types';
import { Queries } from '~/types';

export async function fetchFaucet(input: RequestInit) {
  const res = await fetch(FUEL_FAUCET_URL, {
    ...input,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}

type UseFaucetOpts = {
  onSuccess?: () => void;
};

export function useFaucet(opts: UseFaucetOpts = {}) {
  const wallet = useWallet();
  const balances = useBalances();

  const mutation = useMutation(
    async ({ captcha }: { captcha?: Maybe<string> } = {}) => {
      const response = await fetchFaucet({
        method: 'POST',
        body: JSON.stringify({
          address: wallet?.address.toAddress(),
          captcha: captcha || '',
        }),
      });

      if (response.status !== 'Success') {
        throw new Error(`Invalid faucet response: ${JSON.stringify(response)}`);
      }
    },
    {
      onSuccess: async () => {
        // Navigate to assets page to show new cons
        // https:// github.com/FuelLabs/swayswap-demo/issues/40
        await balances.refetch();
        opts.onSuccess?.();
      },
    }
  );

  const query = useQuery(Queries.FaucetQuery, async () => {
    const res = fetchFaucet({ method: 'GET' });
    return res;
  });

  function handleFaucet(captcha: Maybe<string>) {
    mutation.mutate({ captcha });
  }

  const faucetAmount = useMemo(() => {
    const amount = safeBigInt(query.data?.amount);
    return format(amount);
  }, [query.status]);

  return {
    query,
    mutation,
    handleFaucet,
    faucetAmount,
  };
}
