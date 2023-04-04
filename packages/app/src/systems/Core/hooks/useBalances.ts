import type { UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';

import { usePublisher } from './usePubSub';
import { useWallet } from './useWallet';

import { Queries, AppEvents } from '~/types';

export function useBalances(opts: UseQueryOptions = {}) {
  const { wallet } = useWallet();
  const publisher = usePublisher();

  const optss = useQuery(
    Queries.UserQueryBalances,
    async () => {
      if (!wallet) return [];
      const balances = await wallet.getBalances();
      return balances;
    },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(opts as any),
      onSuccess(data) {
        opts.onSuccess?.(data);
        publisher.emit(AppEvents.updatedBalances, data);
      },
      initialData: [],
      enabled: Boolean(wallet),
    }
  );

  return optss;
}
