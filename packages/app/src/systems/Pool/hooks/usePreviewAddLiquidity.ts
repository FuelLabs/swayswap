import { useUserPositions } from './useUserPositions';

import type { UseCoinInput } from '~/systems/Core';
import {
  divideFnValidOnly,
  parseToFormattedNumber,
  safeBigInt,
  toFixed,
  toNumber,
  ZERO,
} from '~/systems/Core/utils/math';
import type { PoolInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export interface UsePreviewAddLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfoOutput;
}

export function usePreviewAddLiquidity({ fromInput, poolInfo }: UsePreviewAddLiquidityProps) {
  const { totalLiquidity, poolTokensNum } = useUserPositions();
  const amount = safeBigInt(fromInput.amount);

  const liquidityFactor = totalLiquidity.mul(amount);
  const previewTokens = divideFnValidOnly(liquidityFactor, totalLiquidity);
  const nextTotalTokenSupply = previewTokens + toNumber(poolInfo?.lp_token_supply || ZERO);
  const nextCurrentPoolShare = divideFnValidOnly(
    previewTokens + poolTokensNum.toNumber(),
    nextTotalTokenSupply
  );

  let formattedPreviewTokens = parseToFormattedNumber(previewTokens);
  let formattedNextCurrentPoolShare = toFixed(nextCurrentPoolShare * 100);

  /**
   * This is necessary for the first user interaction, when there's any
   * pool already created. So, we need to set values manually.
   */
  if (poolInfo?.eth_reserve === ZERO) {
    formattedPreviewTokens = parseToFormattedNumber(amount);
    formattedNextCurrentPoolShare = toFixed(amount.gt(ZERO) ? 100 : 0);
  }

  return {
    liquidityFactor,
    previewTokens,
    nextCurrentPoolShare,
    nextTotalTokenSupply,
    formattedPreviewTokens,
    formattedNextCurrentPoolShare,
  };
}
