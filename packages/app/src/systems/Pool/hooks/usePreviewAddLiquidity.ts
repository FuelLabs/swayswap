import { useUserPositions } from './useUserPositions';

import type { UseCoinInput } from '~/systems/Core';
import {
  divideFnValidOnly,
  parseToFormattedNumber,
  toBigInt,
  toFixed,
  toNumber,
  ZERO,
} from '~/systems/Core/utils/math';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

export interface UsePreviewAddLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfo;
}

export function usePreviewAddLiquidity({ fromInput, poolInfo }: UsePreviewAddLiquidityProps) {
  const { totalLiquidity, poolTokensNum } = useUserPositions();
  const amount = fromInput.amount || ZERO;

  const liquidityFactor = amount * toBigInt(totalLiquidity);
  const previewTokens = divideFnValidOnly(liquidityFactor, totalLiquidity);
  const nextTotalTokenSupply = previewTokens + toNumber(poolInfo?.lp_token_supply || BigInt(0));
  const nextCurrentPoolShare = divideFnValidOnly(
    BigInt(previewTokens) + poolTokensNum,
    BigInt(nextTotalTokenSupply)
  );

  let formattedPreviewTokens = parseToFormattedNumber(previewTokens);
  let formattedNextCurrentPoolShare = toFixed(nextCurrentPoolShare * 100);

  /**
   * This is necessary for the first user interaction, when there's any
   * pool already created. So, we need to set values manually.
   */
  if (poolInfo?.eth_reserve === ZERO) {
    formattedPreviewTokens = parseToFormattedNumber(amount);
    formattedNextCurrentPoolShare = toFixed(amount > 0 ? 100 : 0);
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
