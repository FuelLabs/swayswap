import { useUserPositions } from '../../../hooks/useUserPositions';

import type { UseCoinInput } from '~/components/CoinInput';
import {
  divideFnValidOnly,
  parseToFormattedNumber,
  toBigInt,
  toFixed,
  toNumber,
  ZERO,
} from '~/lib/math';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

export interface UsePreviewLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfo;
}

export function usePreviewAddLiquidity({ fromInput, poolInfo }: UsePreviewLiquidityProps) {
  const { totalLiquidity, poolTokensNum } = useUserPositions();
  const liquidityFactor = (fromInput.amount || ZERO) * toBigInt(totalLiquidity);
  const previewTokens = divideFnValidOnly(liquidityFactor, totalLiquidity);
  const nextTotalTokenSupply = previewTokens + toNumber(poolInfo?.lp_token_supply || BigInt(0));
  const nextCurrentPoolShare =
    divideFnValidOnly(BigInt(previewTokens) + poolTokensNum, BigInt(nextTotalTokenSupply)) || 1;
  let formattedPreviewTokens = parseToFormattedNumber(previewTokens);
  const formattedNextCurrentPoolShare = toFixed(nextCurrentPoolShare * 100);

  if (poolInfo?.eth_reserve === ZERO) {
    formattedPreviewTokens = parseToFormattedNumber(fromInput.amount || 0);
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
