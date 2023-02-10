import type { FunctionInvocationScope, MultiCallInvocationScope } from 'fuels';
import type { UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';

import type { TransactionCost } from '../utils/gas';
import { emptyTransactionCost, getTransactionCost } from '../utils/gas';

import { useEthBalance } from './useEthBalance';

type ContractCallFuncPromise = () => Promise<FunctionInvocationScope | MultiCallInvocationScope>;
type ContractCallFunc = () => FunctionInvocationScope | MultiCallInvocationScope;
type UseTransactionCost = TransactionCost & {
  isLoading: boolean;
};

export function useTransactionCost(
  queryKey: unknown[],
  request?: ContractCallFunc | ContractCallFuncPromise,
  options?: Omit<UseQueryOptions<TransactionCost>, 'queryKey' | 'queryFn'>
): UseTransactionCost {
  const ethBalance = useEthBalance();

  if (Array.isArray(queryKey)) {
    queryKey.push(ethBalance.formatted);
  }

  const { data, isLoading } = useQuery<TransactionCost>(
    queryKey,
    async () => {
      return getTransactionCost(await request!());
    },
    options
  );

  return {
    ...(data || emptyTransactionCost()),
    isLoading,
  };
}
