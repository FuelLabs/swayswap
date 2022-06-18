import { useSelector } from "@xstate/react";
import { useMemo } from "react";

import type { SwapMachineState } from "../machines/swapMachine";
import { SwapDirection } from "../types";

import { useSwapContext } from "./useSwap";

import type { CoinSelectorProps } from "~/systems/Core";
import { isCoinEth } from "~/systems/Core";

const selectors = {
  coinFrom: (state: SwapMachineState) => {
    return state.context.coinFrom;
  },
  coinTo: (state: SwapMachineState) => {
    return state.context.coinTo;
  },
};

export function useSwapCoinSelector(
  direction: SwapDirection
): CoinSelectorProps {
  const { service, send } = useSwapContext();
  const isFrom = direction === SwapDirection.fromTo;
  const coinSelector = isFrom ? selectors.coinFrom : selectors.coinTo;
  const coin = useSelector(service, coinSelector);
  const isETH = useMemo(() => isCoinEth(coin), [coin?.assetId]);

  return {
    coin,
    onChange: (item) => {
      send("SELECT_COIN", { data: { direction, coin: item } });
    },
    ...(isETH && {
      isReadOnly: true,
      tooltip: "Currently, we only support ETH to TOKEN.",
    }),
  } as CoinSelectorProps;
}
