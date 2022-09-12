import { getPoolRatio } from '../utils/helpers';

import { usePoolInfo } from './usePoolInfo';

import { TOKENS, useBalances, ZERO, safeBigInt, format, divide, multiply } from '~/systems/Core';

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

  const pooledDAI = divide(multiply(poolTokensNum, tokenReserve), totalLiquidity);
  const pooledETH = divide(multiply(poolTokensNum, ethReserve), totalLiquidity);
  const formattedPooledDAI = format(pooledDAI);
  const formattedPooledETH = format(pooledETH);
  const formattedPoolTokens = poolTokensNum ? format(poolTokensNum) : '0';

  const poolShare = divide(poolTokensNum, totalLiquidity);
  const formattedPoolShare = format(poolShare.mul(100));
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
