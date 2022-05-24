import { useQuery } from 'react-query';

import type { ExchangeContractAbi } from '~/types/contracts';

export function usePoolInfo(contract: ExchangeContractAbi) {
  return useQuery('PoolPage-poolInfo', () => contract.callStatic.get_info());
}
