import Decimal from 'decimal.js';
import type { BN } from 'fuels';

import { calculatePercentage, format, isZero, safeBigInt, toFixed, ZERO } from '~/systems/Core';
import type { Maybe } from '~/types';
import type { PoolInfoOutput, PositionInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export function getPoolRatio(info?: Maybe<PoolInfoOutput>) {
  if (!info) return new Decimal(1);
  const tokenReserve = info.token_reserve;
  const ethReserve = info.eth_reserve;
  if (isZero(tokenReserve)) return new Decimal(1);
  return new Decimal(ethReserve.toHex()).div(tokenReserve.toHex());
}

export function getPoolInfoPreview(info: Maybe<PositionInfoOutput>, poolTokens: BN) {
  // Amounts
  const totalLiquidity = safeBigInt(info?.lp_token_supply);
  const tokenReserve = safeBigInt(info?.token_reserve);
  const ethReserve = safeBigInt(info?.eth_reserve);
  const pooledETH = safeBigInt(info?.eth_amount);
  const pooledDAI = safeBigInt(info?.token_amount);
  const poolRatio = getPoolRatio(info);
  const poolShare = calculatePercentage(poolTokens, totalLiquidity);
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
