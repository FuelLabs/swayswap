import { useQuery } from 'react-query';

import { useContract } from '~/systems/Core';

export function usePoolInfo() {
  const contract = useContract();
  return useQuery('PoolPage-poolInfo', async () => contract?.dryRun.get_pool_info());
}
