import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';

import { useBalances } from './useBalances';
import { useWallet } from './useWallet';

import { FUEL_FAUCET_URL } from '~/config';
import { parseToFormattedNumber } from '~/lib/math';
import { Queries } from '~/types/queries';

async function fetchFaucet(input: RequestInit) {
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
    async ({ captcha }: { captcha?: string | null } = {}) => {
      const response = await fetchFaucet({
        method: 'POST',
        body: JSON.stringify({
          address: wallet?.address,
          captcha: captcha || '',
        }),
      });

      if (response.status !== 'Success') {
        throw new Error(`Invalid faucet response: ${JSON.stringify(response)}`);
      }
    },
    {
      onSuccess: () => {
        // Navigate to assets page to show new cons
        // https:// github.com/FuelLabs/swayswap-demo/issues/40
        balances.refetch();
        opts.onSuccess?.();
      },
    }
  );

  const query = useQuery(Queries.FaucetQuery, async () => {
    const res = fetchFaucet({ method: 'GET' });
    return res;
  });

  function handleFaucet(captcha: string | null) {
    mutation.mutate({ captcha });
  }

  const faucetAmount = useMemo(() => {
    const amount = query.data?.amount || BigInt(0);
    return parseToFormattedNumber(amount);
  }, [query.status]);

  return {
    query,
    mutation,
    handleFaucet,
    faucetAmount,
  };
}
