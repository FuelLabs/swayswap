import { useBalances } from "./useBalances";
import { usePoolInfo } from "./usePoolInfo";

import { DECIMAL_UNITS } from "~/config";
import CoinsMetadata from "~/lib/CoinsMetadata";
import { ZERO } from "~/lib/constants";
import { formatUnits, toNumber } from "~/lib/math";

export function useUserPositions() {
  const { data: info } = usePoolInfo();
  const { data: balances } = useBalances();
  const lpToken = CoinsMetadata.find((c) => c.symbol === "ETH/DAI");
  const lpTokenBalance =
    balances?.find((coin) => coin.assetId === lpToken?.assetId)?.amount || ZERO;

  const pooledDAI = info && formatUnits(info.token_reserve, DECIMAL_UNITS);
  const pooledETH = info && formatUnits(info.eth_reserve, DECIMAL_UNITS);
  const poolTokens = lpTokenBalance
    ? formatUnits(lpTokenBalance, DECIMAL_UNITS)
    : "0";

  const lpTokenBalanceNum = toNumber(lpTokenBalance);
  const totalLiquidity = toNumber(info?.lp_token_supply || ZERO);
  const poolShare = ((lpTokenBalanceNum / totalLiquidity) * 100).toFixed(2);
  const hasPositions = lpTokenBalance > 0;

  return {
    pooledDAI,
    pooledETH,
    poolTokens,
    poolShare,
    hasPositions,
  };
}
