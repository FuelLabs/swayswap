import Decimal from 'decimal.js';
import { NativeAssetId } from 'fuels';
import { useQuery } from 'react-query';

import { useUserPositions } from './useUserPositions';

import type { UseCoinInput } from '~/systems/Core';
import { useContract } from '~/systems/Core';
import { format, safeBigInt, ZERO, isZero, toFixed } from '~/systems/Core/utils/math';
import type { PoolInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export interface UsePreviewAddLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfoOutput;
}

export function usePreviewAddLiquidity({ fromInput, poolInfo }: UsePreviewAddLiquidityProps) {
  const { totalLiquidity, poolTokensNum } = useUserPositions();
  const contract = useContract();
  const amount = safeBigInt(fromInput.amount);
  let previewTokens = ZERO;
  let nextTotalTokenSupply = ZERO;
  let nextCurrentPoolShare = new Decimal(0);
  let formattedNextCurrentPoolShare = '0.0';
  let formattedPreviewTokens = '0.0';

  const { data } = useQuery(['PreviewTokenAmount', amount], async () => {
    if (!contract) return;
    const { value } = await contract.functions.get_add_liquidity(amount, NativeAssetId).get();
    return value;
  });

  if (!isZero(totalLiquidity) && !isZero(amount) && !isZero(data?.lp_token_received)) {
    previewTokens = safeBigInt(data?.lp_token_received);
    nextTotalTokenSupply = previewTokens.add(safeBigInt(poolInfo?.lp_token_supply));
    nextCurrentPoolShare = new Decimal(previewTokens.toHex())
      .add(poolTokensNum.toHex())
      .div(nextTotalTokenSupply.toHex());
    formattedPreviewTokens = format(previewTokens);
    formattedNextCurrentPoolShare = toFixed(
      new Decimal(safeBigInt(data?.lp_token_received).toHex())
        .div(nextTotalTokenSupply.toHex())
        .toString()
    );
  }

  /**
   * This is necessary for the first user interaction, when there's any
   * pool already created. So, we need to set values manually.
   */
  if (isZero(poolInfo?.eth_reserve)) {
    formattedPreviewTokens = format(amount);
    formattedNextCurrentPoolShare = '100%';
  }

  return {
    previewTokens,
    nextCurrentPoolShare,
    nextTotalTokenSupply,
    formattedPreviewTokens,
    formattedNextCurrentPoolShare,
  };
}
