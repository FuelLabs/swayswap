import type { ScriptTransactionRequest } from 'fuels';
import type { UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';

import type { TransactionCost } from '../utils/gas';
import { emptyTransactionCost, getTransactionCost } from '../utils/gas';

import { useEthBalance } from './useEthBalance';

export function useTransactionCost(
  queryKey: unknown[],
  request: () => Promise<ScriptTransactionRequest>,
  options?: Omit<UseQueryOptions<TransactionCost>, 'queryKey' | 'queryFn'>
) {
  const ethBalance = useEthBalance();

  if (Array.isArray(queryKey)) {
    queryKey.push(ethBalance.formatted);
  }

  const { data } = useQuery<TransactionCost>(
    queryKey,
    async () => getTransactionCost(request()),
    options
  );

  return data || emptyTransactionCost();
}
