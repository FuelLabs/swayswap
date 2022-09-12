import { bn } from 'fuels';

import type { UseCoinInput } from '~/systems/Core';
import { divide, safeBigInt, useBalances, toBigInt } from '~/systems/Core';
import type { PoolInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export interface UsePreviewLiquidityProps {
  fromInput: UseCoinInput;
  poolInfo?: PoolInfoOutput;
  contractId: string;
}

export function usePreviewLiquidity({ fromInput, poolInfo, contractId }: UsePreviewLiquidityProps) {
  const balances = useBalances();
  const fromAmount = safeBigInt(fromInput.amount);
  const lpTokenSupply = safeBigInt(poolInfo?.lp_token_supply, 1);
  const ethReserve = safeBigInt(poolInfo?.eth_reserve, 1);

  const liquidityFactor = toBigInt(fromAmount.mul(lpTokenSupply));
  const previewTokensToReceive = divide(liquidityFactor, ethReserve);
  const nextTotalTokenSupply = previewTokensToReceive.add(lpTokenSupply);
  const poolContractBalance = balances?.data?.find((item) => item.assetId === contractId);
  const currentPoolTokensAmount = safeBigInt(poolContractBalance?.amount);
  const nextCurrentPoolShare =
    divide(previewTokensToReceive.add(currentPoolTokensAmount), nextTotalTokenSupply) || bn(1);

  return {
    liquidityFactor,
    previewTokensToReceive,
    nextTotalTokenSupply,
    poolContractBalance,
    currentPoolTokensAmount,
    nextCurrentPoolShare,
  };
}
