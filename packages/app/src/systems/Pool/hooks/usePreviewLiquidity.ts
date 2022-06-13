import { calculateRatio } from '../utils/helpers';

import type { UseCoinInput } from '~/systems/Core';
import { useBalances, ZERO, toBigInt, toNumber } from '~/systems/Core';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

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
