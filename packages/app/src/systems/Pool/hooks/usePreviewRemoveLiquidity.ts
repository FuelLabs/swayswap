import Decimal from 'decimal.js';
import type { BN } from 'fuels';
import { useMemo } from 'react';

import { getPoolInfoPreview } from '../utils/helpers';

import { usePositionInfo } from './usePoolInfo';

import { CONTRACT_ID } from '~/config';
import {
  calculatePercentage,
  format,
  getCoin,
  isZero,
  safeBigInt,
  toFixed,
  useBalances,
  ZERO,
} from '~/systems/Core';
import type { Maybe } from '~/types';

export function usePreviewRemoveLiquidity(amount: Maybe<BN>) {
  const { data: balances } = useBalances();
  const poolTokens = useMemo(() => {
    const lpTokenAmount = getCoin(balances || [], CONTRACT_ID)?.amount;
    const poolTokensNum = safeBigInt(lpTokenAmount);
    return poolTokensNum;
  }, [balances]);
  const { data: info } = usePositionInfo(amount || ZERO);
  const poolPreview = useMemo(() => getPoolInfoPreview(info, amount || ZERO), [info, amount]);
  let nextPoolTokens = ZERO;
  let nextPoolShare = new Decimal(0);

  if (!isZero(poolTokens)) {
    nextPoolTokens = poolTokens.sub(poolPreview.poolTokens);
    if (nextPoolTokens.lte(poolPreview.totalLiquidity)) {
      nextPoolShare = calculatePercentage(nextPoolTokens, poolPreview.totalLiquidity);
    }
  }

  const formattedNextPoolTokens = format(nextPoolTokens);
  const formattedNextPoolShare = toFixed(nextPoolShare.toString());

  return {
    ...poolPreview,
    formattedNextPoolTokens,
    formattedNextPoolShare,
  };
}
