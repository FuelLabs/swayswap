import { useUserPositions } from '../../../hooks/useUserPositions';

import type { UseCoinInput } from '~/components/CoinInput';
import { DECIMAL_UNITS } from '~/config';
import { divideFnValidOnly, parseToFormattedNumber, toBigInt, toNumber, ZERO } from '~/lib/math';
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
  let formattedPreviewTokens = parseToFormattedNumber(previewTokens, DECIMAL_UNITS);
  const formattedNextCurrentPoolShare = parseFloat((nextCurrentPoolShare * 100).toFixed(6));

  if (poolInfo?.eth_reserve === ZERO) {
    formattedPreviewTokens = parseToFormattedNumber(fromInput.amount || 0, DECIMAL_UNITS);
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
