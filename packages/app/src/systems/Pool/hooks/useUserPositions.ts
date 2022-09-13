import Decimal from 'decimal.js';
import { bn } from 'fuels';

import { getPoolRatio } from '../utils/helpers';

import { usePoolInfo } from './usePoolInfo';

import { TOKENS, useBalances, ZERO, safeBigInt, format, isZero } from '~/systems/Core';

export function useUserPositions() {
  const { data: info } = usePoolInfo();
  const { data: balances } = useBalances();

  const lpToken = TOKENS.find((c) => c.symbol === 'ETH/DAI');
  const poolTokens = balances?.find((coin) => coin.assetId === lpToken?.assetId)?.amount;
  const poolTokensNum = safeBigInt(poolTokens);

  // info?.token_reserve
  const totalLiquidity = safeBigInt(info?.lp_token_supply);
  const tokenReserve = safeBigInt(info?.token_reserve);
  const ethReserve = safeBigInt(info?.eth_reserve);

  const formattedTokenReserve = format(tokenReserve);
  const formattedEthReserve = format(ethReserve);
  const poolRatio = getPoolRatio(info);
  let pooledDAI = ZERO;
  let pooledETH = ZERO;

  if (!isZero(totalLiquidity)) {
    pooledDAI = bn(
      new Decimal(poolTokensNum.toHex())
        .mul(tokenReserve.toHex())
        .div(totalLiquidity.toHex())
        .round()
        .toHex()
    );
    pooledETH = bn(
      new Decimal(poolTokensNum.toHex())
        .mul(ethReserve.toHex())
        .div(totalLiquidity.toHex())
        .round()
        .toHex()
    );
  }

  const formattedPooledDAI = format(pooledDAI);
  const formattedPooledETH = format(pooledETH);
  const formattedPoolTokens = poolTokensNum ? format(poolTokensNum) : '0';

  const poolShare = new Decimal(poolTokensNum.toHex()).div(totalLiquidity.toHex());
  const formattedPoolShare = poolShare.mul(100).toFixed(2);
  const hasPositions = poolTokensNum > ZERO;

  return {
    pooledDAI,
    pooledETH,
    poolShare,
    poolTokens,
    poolTokensNum,
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
