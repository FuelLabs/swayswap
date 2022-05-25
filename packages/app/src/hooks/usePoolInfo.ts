import { formatUnits } from 'ethers/lib/utils';
import { useQuery } from 'react-query';

import { DECIMAL_UNITS } from '~/config';
import { useContract } from '~/context/AppContext';

export function usePoolInfo() {
  const contract = useContract();
  const result = useQuery('PoolPage-poolInfo', () => contract?.callStatic.get_info());

  const info = result.data;
  const pooledDAI = info && formatUnits(info[0], DECIMAL_UNITS);
  const pooledETH = info && formatUnits(info[1], DECIMAL_UNITS);

  return {
    ...result,
    pooledETH,
    pooledDAI,
  };
}
