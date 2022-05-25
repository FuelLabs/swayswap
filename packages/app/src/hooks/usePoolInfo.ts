import { useQuery } from 'react-query';

import type { Exchange_contractAbi } from '~/types/contracts';

export function usePoolInfo(contract: Exchange_contractAbi) {
  return useQuery('PoolPage-poolInfo', () => contract.callStatic.get_info());
}
