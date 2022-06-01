import { useQuery } from 'react-query';

import { useContract } from '~/hooks/useContract';

export function usePoolInfo() {
  const contract = useContract();
  return useQuery('PoolPage-poolInfo', () => contract?.dryRun.get_info());
}
