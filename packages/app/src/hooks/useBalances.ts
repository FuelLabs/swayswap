import type { UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';

import { useWallet } from '~/context/AppContext';
import { queryClient } from '~/lib/queryClient';
import { Queries } from '~/types/queries';

export function useBalances(opts: UseQueryOptions = {}) {
  const wallet = useWallet();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery(Queries.UserQueryBalances, () => wallet?.getBalances(), opts as any);
}

export function refreshBalances() {
  return queryClient.fetchQuery(Queries.UserQueryBalances);
}
