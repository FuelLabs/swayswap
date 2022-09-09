import { useQuery } from 'react-query';

import { useContract } from '~/systems/Core';

export function usePoolInfo() {
  const contract = useContract();
  return useQuery('PoolPage-poolInfo', async () => {
    if (!contract) return;
    const { value: poolInfo } = await contract.functions.get_pool_info().get();
    return poolInfo;
  });
}
