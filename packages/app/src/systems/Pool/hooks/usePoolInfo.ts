import type { BN } from 'fuels';
import { bn } from 'fuels';
import { useQuery } from 'react-query';

import { useContract } from '~/systems/Core';

export function usePoolInfo() {
  const contract = useContract();
  return useQuery('PoolPage-poolInfo', async () => {
    if (!contract) return;
    const { value: poolInfo } = await contract.functions
      .get_pool_info() // TODO: do we need the parameter?
      .call();
    return poolInfo;
  });
}

export function usePositionInfo(amount: BN) {
  const contract = useContract();
  return useQuery(['PoolPage-positionInfo', amount], async () => {
    if (!contract || bn(amount).isZero()) return;
    const { value: position } = await contract.functions.get_position(amount).call();
    return position;
  });
}
