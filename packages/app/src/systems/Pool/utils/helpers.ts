import Decimal from 'decimal.js';
import type { BN } from 'fuels';
import { bn, format, toFixed } from 'fuels';

import { calculatePercentage, ZERO } from '~/systems/Core';
import type { Maybe } from '~/types';
import type { PoolInfoOutput, PositionInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export function getPoolRatio(info?: Maybe<PoolInfoOutput>) {
  if (!info) return new Decimal(1);
  const tokenReserve2 = info.token_reserve2;
  const tokenReserve1 = info.token_reserve1;
  if (bn(tokenReserve2).isZero()) return new Decimal(1);
  return new Decimal(tokenReserve1.toHex()).div(tokenReserve2.toHex());
}

export type PoolInfoPreview = {
  pooledDAI: BN;
  pooledETH: BN;
  poolShare: Decimal;
  poolTokens: BN;
  formattedPooledDAI: string;
  formattedPooledETH: string;
  formattedPoolShare: string;
  formattedPoolTokens: string;
  formattedTokenReserve: string;
  formattedEthReserve: string;
  hasPositions: boolean;
  totalLiquidity: BN;
  tokenReserve: BN;
  ethReserve: BN;
  poolRatio: Decimal;
};

export function getPoolInfoPreview(
  info: Maybe<PositionInfoOutput>,
  poolTokens: BN
): PoolInfoPreview {
  // Amounts
  const totalLiquidity = bn(info?.lp_token_supply);
  const tokenReserve = bn(info?.token_reserve2);
  const ethReserve = bn(info?.token_reserve1);
  const pooledETH = bn(info?.token_amount1);
  const pooledDAI = bn(info?.token_amount2);
  const poolRatio = getPoolRatio(info);
  const poolShare = totalLiquidity.isZero()
    ? new Decimal(0)
    : calculatePercentage(poolTokens, totalLiquidity);
  const hasPositions = poolTokens.gt(ZERO);

  // Formatted amounts
  const formattedPoolShare = toFixed(poolShare.toString());
  const formattedTokenReserve = format(tokenReserve);
  const formattedEthReserve = format(ethReserve);
  const formattedPooledDAI = format(pooledDAI);
  const formattedPooledETH = format(pooledETH);
  const formattedPoolTokens = format(poolTokens);

  return {
    pooledDAI,
    pooledETH,
    poolShare,
    poolTokens,
    formattedPooledDAI,
    formattedPooledETH,
    formattedPoolShare,
    formattedPoolTokens,
    formattedTokenReserve,
    formattedEthReserve,
    hasPositions,
    totalLiquidity,
    tokenReserve,
    ethReserve,
    poolRatio,
  };
}
