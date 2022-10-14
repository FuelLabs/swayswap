import { bn } from 'fuels';
import { useMemo } from 'react';

import { getPoolInfoPreview } from '../utils/helpers';

import { usePositionInfo } from './usePoolInfo';

import { CONTRACT_ID } from '~/config';
import { useBalances, getCoin } from '~/systems/Core';

export function useUserPositions() {
  const { data: balances } = useBalances();
  const poolTokens = useMemo(() => {
    const lpTokenAmount = getCoin(balances || [], CONTRACT_ID)?.amount;
    const poolTokensNum = bn(lpTokenAmount);
    return poolTokensNum;
  }, [balances]);
  const { data: info } = usePositionInfo(poolTokens);
  const poolPreview = useMemo(() => getPoolInfoPreview(info, poolTokens), [info, poolTokens]);

  return poolPreview;
}
