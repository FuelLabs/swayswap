import { useBalances } from "./useBalances";
import { usePoolInfo } from "./usePoolInfo";

import CoinsMetadata from "~/lib/CoinsMetadata";
import {
  ZERO,
  divideFnValidOnly,
  parseToFormattedNumber,
  toBigInt,
  multiplyFn,
  toFixed,
} from "~/lib/math";

export function useUserPositions() {
  const { data: info } = usePoolInfo();
  const { data: balances } = useBalances();

  const lpToken = CoinsMetadata.find((c) => c.symbol === "ETH/DAI");

  const poolTokens = balances?.find(
    (coin) => coin.assetId === lpToken?.assetId
  )?.amount;
  const poolTokensNum = poolTokens || ZERO;

  // info?.token_reserve
  const totalLiquidity = toBigInt(info?.lp_token_supply || ZERO);
  const tokenReserve = toBigInt(info?.token_reserve || ZERO);
  const ethReserve = toBigInt(info?.eth_reserve || ZERO);

  const formattedTokenReserve = parseToFormattedNumber(tokenReserve);
  const formattedEthReserve = parseToFormattedNumber(ethReserve);

  const pooledDAI = divideFnValidOnly(
    multiplyFn(poolTokensNum, tokenReserve),
    totalLiquidity
  );
  const pooledETH = divideFnValidOnly(
    multiplyFn(poolTokensNum, ethReserve),
    totalLiquidity
  );
  const formattedPooledDAI = parseToFormattedNumber(pooledDAI);
  const formattedPooledETH = parseToFormattedNumber(pooledETH);
  const formattedPoolTokens = poolTokensNum
    ? parseToFormattedNumber(poolTokensNum)
    : "0";

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
  };
}
