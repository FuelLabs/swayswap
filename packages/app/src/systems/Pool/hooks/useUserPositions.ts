import { getPoolRatio } from '../utils/helpers';

import { usePoolInfo } from './usePoolInfo';

import {
  TOKENS,
  useBalances,
  ZERO,
  divideFnValidOnly,
  parseToFormattedNumber,
  toBigInt,
  multiplyFn,
  toFixed,
} from '~/systems/Core';

export function useUserPositions() {
  const { data: info } = usePoolInfo();
  const { data: balances } = useBalances();

  const lpToken = TOKENS.find((c) => c.symbol === 'ETH/DAI');

  const poolTokens = balances?.find((coin) => coin.assetId === lpToken?.assetId)?.amount;
  const poolTokensNum = poolTokens || ZERO;

  // info?.token_reserve
  const totalLiquidity = toBigInt(info?.lp_token_supply || ZERO);
  const tokenReserve = toBigInt(info?.token_reserve || ZERO);
  const ethReserve = toBigInt(info?.eth_reserve || ZERO);

  const formattedTokenReserve = parseToFormattedNumber(tokenReserve);
  const formattedEthReserve = parseToFormattedNumber(ethReserve);
  const poolRatio = getPoolRatio(info);

  const pooledDAI = divideFnValidOnly(multiplyFn(poolTokensNum, tokenReserve), totalLiquidity);
  const pooledETH = divideFnValidOnly(multiplyFn(poolTokensNum, ethReserve), totalLiquidity);
  const formattedPooledDAI = parseToFormattedNumber(pooledDAI);
  const formattedPooledETH = parseToFormattedNumber(pooledETH);
  const formattedPoolTokens = poolTokensNum ? parseToFormattedNumber(poolTokensNum) : '0';

  const poolShare = divideFnValidOnly(poolTokensNum, totalLiquidity);
  const formattedPoolShare = toFixed(poolShare * 100);
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
