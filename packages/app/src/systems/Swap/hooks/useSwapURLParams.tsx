import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type { SwapMachineContext } from "../types";
import { SwapDirection } from "../types";

import { useSwapGlobalState } from "./useSwapGlobalState";

import { TOKENS, ETH, DAI } from "~/systems/Core";
import type { Maybe } from "~/types";

function findCoin(dir: Maybe<string>) {
  return useMemo(() => {
    return dir && TOKENS.find((t) => t.assetId === dir || t.symbol === dir);
  }, [dir]);
}

/**
 * TODO: this method in future can generate bugs since Coin.symbol
 * isn't something unique.
 */
function getParamsByContext(ctx: Partial<SwapMachineContext>) {
  if (!ctx.coinFrom && !ctx.coinTo) {
    return { from: ETH.symbol, to: DAI.symbol };
  }
  return {
    ...(ctx.coinFrom && { from: ctx.coinFrom.symbol }),
    ...(ctx.coinTo && { to: ctx.coinTo.symbol }),
  };
}

export function useSwapURLParams() {
  const [globalState] = useSwapGlobalState();
  const [query, setQuery] = useSearchParams(getParamsByContext(globalState));
  const from = query.get(SwapDirection.fromTo);
  const to = query.get(SwapDirection.toFrom);
  const coinFrom = findCoin(from);
  const coinTo = findCoin(to);

  function setCoinParams(ctx: SwapMachineContext) {
    setQuery(getParamsByContext(ctx), { replace: true });
  }

  return {
    coinFrom,
    coinTo,
    setCoinParams,
  };
}
