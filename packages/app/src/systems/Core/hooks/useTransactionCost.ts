import type { ContractCall } from 'fuels';
import type { UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';

import type { TransactionCost } from '../utils/gas';
import { emptyTransactionCost, getTransactionCost } from '../utils/gas';

import { useEthBalance } from './useEthBalance';

type ContractCallFuncPromise = () => Promise<ContractCall>;
type ContractCallFunc = () => ContractCall;

export function useTransactionCost(
  queryKey: unknown[],
  request: ContractCallFunc | ContractCallFuncPromise,
  options?: Omit<UseQueryOptions<TransactionCost>, 'queryKey' | 'queryFn'>
) {
  const ethBalance = useEthBalance();

  if (Array.isArray(queryKey)) {
    queryKey.push(ethBalance.formatted);
  }

  const { data } = useQuery<TransactionCost>(
    queryKey,
    async () => getTransactionCost(await request()),
    options
  );

  return data || emptyTransactionCost();
}
