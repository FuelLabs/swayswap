import { bn } from 'fuels';

import { useUserPositions } from './useUserPositions';

import type { UseCoinInput } from '~/systems/Core';
import { format, divide, safeBigInt, ZERO } from '~/systems/Core/utils/math';
import type { PoolInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export interface UsePreviewAddLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfoOutput;
}

export function usePreviewAddLiquidity({ fromInput, poolInfo }: UsePreviewAddLiquidityProps) {
  const { totalLiquidity, poolTokensNum } = useUserPositions();
  const amount = safeBigInt(fromInput.amount);

  const liquidityFactor = totalLiquidity.mul(amount);
  const previewTokens = divide(liquidityFactor, totalLiquidity);
  const nextTotalTokenSupply = previewTokens.add(safeBigInt(poolInfo?.lp_token_supply));
  const nextCurrentPoolShare = divide(previewTokens.add(poolTokensNum), nextTotalTokenSupply);

  let formattedPreviewTokens = format(previewTokens);
  let formattedNextCurrentPoolShare = format(nextCurrentPoolShare.mul(100));

  /**
   * This is necessary for the first user interaction, when there's any
   * pool already created. So, we need to set values manually.
   */
  if (poolInfo?.eth_reserve === ZERO) {
    formattedPreviewTokens = format(amount);
    formattedNextCurrentPoolShare = format(amount.gt(ZERO) ? bn(100) : bn(0));
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
