import { formatUnits } from "ethers/lib/utils";
import { toNumber } from "fuels";

import { useBalances } from "./useBalances";
import { usePoolInfo } from "./usePoolInfo";

import { DECIMAL_UNITS } from "~/config";
import CoinsMetadata from "~/lib/CoinsMetadata";
import { divideFnValidOnly } from "~/lib/utils";

export function useUserPositions() {
  const { data: info } = usePoolInfo();
  const { data: balances } = useBalances();

  const lpToken = CoinsMetadata.find((c) => c.symbol === "ETH/DAI");

  const poolTokens = balances?.find(
    (coin) => coin.assetId === lpToken?.assetId
  )?.amount;
  const poolTokensNum = toNumber(poolTokens || BigInt(0));

  const totalLiquidity = toNumber(info?.lp_token_supply || BigInt(0));
  const tokenReserve = toNumber(info?.token_reserve || BigInt(0));
  const ethReserve = toNumber(info?.eth_reserve || BigInt(0));

  const pooledDAI = divideFnValidOnly(
    poolTokensNum * tokenReserve,
    totalLiquidity
  );
  const pooledETH = divideFnValidOnly(
    poolTokensNum * ethReserve,
    totalLiquidity
  );
  const formattedPooledDAI = formatUnits(Math.floor(pooledDAI), DECIMAL_UNITS);
  const formattedPooledETH = formatUnits(Math.floor(pooledETH), DECIMAL_UNITS);
  const formattedPoolTokens = poolTokensNum
    ? formatUnits(poolTokensNum, DECIMAL_UNITS)
    : "0";

  const poolShare = poolTokensNum / totalLiquidity;
  const formattedPoolShare = parseFloat((poolShare * 100).toFixed(6));
  const hasPositions = poolTokensNum > BigInt(0);

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
    hasPositions,
    totalLiquidity,
    tokenReserve,
    ethReserve,
  };
}
