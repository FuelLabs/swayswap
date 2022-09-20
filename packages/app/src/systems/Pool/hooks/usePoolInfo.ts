import type { BN } from 'fuels';
import { useQuery } from 'react-query';

import { isZero, useContract } from '~/systems/Core';

export function usePoolInfo() {
  const contract = useContract();
  return useQuery('PoolPage-poolInfo', async () => {
    if (!contract) return;
    const { value: poolInfo } = await contract.functions.get_pool_info().get({
      fundTransaction: false,
    });
    return poolInfo;
  });
}

export function usePositionInfo(amount: BN) {
  const contract = useContract();
  return useQuery(['PoolPage-positionInfo', amount], async () => {
    if (!contract || isZero(amount)) return;
    const { value: position } = await contract.functions.get_position(amount).get();
    return position;
  });
}
