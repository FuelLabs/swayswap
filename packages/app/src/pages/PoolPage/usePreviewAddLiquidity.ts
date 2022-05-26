import { toNumber } from 'fuels';

import { useUserPositions } from '../../hooks/useUserPositions';

import type { UseCoinInput } from '~/components/CoinInput';
import { DECIMAL_UNITS } from '~/config';
import { divideFnValidOnly, parseToFormattedNumber } from '~/lib/math';
import type { PoolInfo } from '~/types/contracts/Exchange_contractAbi';

export interface UsePreviewLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfo;
}

export function usePreviewAddLiquidity({ fromInput, poolInfo }: UsePreviewLiquidityProps) {
  const { totalLiquidity, poolTokensNum } = useUserPositions();
  const liquidityFactor = BigInt(toNumber(fromInput.amount || BigInt(0)) * totalLiquidity);
  const previewTokens = divideFnValidOnly(liquidityFactor, totalLiquidity);
  const nextTotalTokenSupply = previewTokens + toNumber(poolInfo?.lp_token_supply || BigInt(0));
  const nextCurrentPoolShare =
    divideFnValidOnly(BigInt(previewTokens + poolTokensNum), BigInt(nextTotalTokenSupply)) || 1;

  const formattedPreviewTokens = parseToFormattedNumber(previewTokens, DECIMAL_UNITS);

  const formattedNextCurrentPoolShare = parseFloat((nextCurrentPoolShare * 100).toFixed(6));

  return {
    liquidityFactor,
    previewTokens,
    nextCurrentPoolShare,
    nextTotalTokenSupply,
    formattedPreviewTokens,
    formattedNextCurrentPoolShare,
  };
}
