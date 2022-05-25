import { toNumber } from 'fuels';

import { useBalances } from './useBalances';

import type { UseCoinInput } from '~/components/CoinInput';
import { calculateRatio } from '~/lib/asset';
import type { PoolInfo } from '~/types/contracts/Exchange_contractAbi';

export interface UsePreviewLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfo;
  contractId: string;
}

export function usePreviewLiquidity({ fromInput, poolInfo, contractId }: UsePreviewLiquidityProps) {
  const balances = useBalances();
  const liquidityFactor = BigInt(
    toNumber(fromInput.amount || BigInt(0)) * toNumber(poolInfo?.lp_token_supply || BigInt(1))
  );
  const previewTokensToReceive = calculateRatio(
    liquidityFactor,
    poolInfo?.eth_reserve || BigInt(1)
  );
  const nextTotalTokenSupply =
    previewTokensToReceive + toNumber(poolInfo?.lp_token_supply || BigInt(0));
  const poolContractBalance = balances?.data?.find((item) => item.assetId === contractId);
  const currentPoolTokensAmount = toNumber(poolContractBalance?.amount || BigInt(0));
  const nextCurrentPoolShare =
    calculateRatio(
      BigInt(previewTokensToReceive + currentPoolTokensAmount),
      BigInt(nextTotalTokenSupply)
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
