import type { UseCoinInput } from '~/systems/Core';
import { divideFnValidOnly, safeBigInt, useBalances, toBigInt, toNumber } from '~/systems/Core';
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

  const liquidityFactor = toBigInt(toNumber(fromAmount) * toNumber(lpTokenSupply));
  const previewTokensToReceive = divideFnValidOnly(liquidityFactor, ethReserve);
  const nextTotalTokenSupply = previewTokensToReceive + toNumber(lpTokenSupply);
  const poolContractBalance = balances?.data?.find((item) => item.assetId === contractId);
  const currentPoolTokensAmount = toNumber(poolContractBalance?.amount);
  const nextCurrentPoolShare =
    divideFnValidOnly(
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
