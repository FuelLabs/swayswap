import { useBalances } from './useBalances';

import type { UseCoinInput } from '~/components/CoinInput';
import { calculateRatio } from '~/lib/asset';
import { ZERO, toBigInt, toNumber } from '~/lib/math';
import type { PoolInfo } from '~/types/contracts/Exchange_contractAbi';

export interface UsePreviewLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfo;
  contractId: string;
}

export function usePreviewLiquidity({ fromInput, poolInfo, contractId }: UsePreviewLiquidityProps) {
  const balances = useBalances();
  const liquidityFactor = toBigInt(
    toNumber(fromInput.amount || ZERO) * toNumber(poolInfo?.lp_token_supply || toBigInt(1))
  );
  const previewTokensToReceive = calculateRatio(
    liquidityFactor,
    poolInfo?.eth_reserve || toBigInt(1)
  );
  const nextTotalTokenSupply = previewTokensToReceive + toNumber(poolInfo?.lp_token_supply || ZERO);
  const poolContractBalance = balances?.data?.find((item) => item.assetId === contractId);
  const currentPoolTokensAmount = toNumber(poolContractBalance?.amount || ZERO);
  const nextCurrentPoolShare =
    calculateRatio(
      toBigInt(previewTokensToReceive + currentPoolTokensAmount),
      toBigInt(nextTotalTokenSupply)
    ) || 1;

  return {
    liquidityFactor,
    previewTokensToReceive,
    nextTotalTokenSupply,
    poolContractBalance,
    currentPoolTokensAmount,
    nextCurrentPoolShare,
  };
}
