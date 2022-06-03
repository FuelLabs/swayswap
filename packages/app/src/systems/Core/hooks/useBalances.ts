import type { UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';

import { useWallet } from './useWallet';

import { Queries } from '~/types';

export function useBalances(opts: UseQueryOptions = {}) {
  const wallet = useWallet();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery(Queries.UserQueryBalances, () => wallet?.getBalances(), opts as any);
}
