import { useSelector } from "@xstate/react";
import { useMemo } from "react";

import type { SwapMachineState } from "../machines/swapMachine";
import { SwapDirection } from "../types";

import { useSwapContext } from "./useSwap";

import type { CoinSelectorProps } from "~/systems/Core";
import { isCoinEth } from "~/systems/Core";

const selectors = {
  coinFrom: (state: SwapMachineState) => state.context.coinFrom,
  fromBalance: (state: SwapMachineState) => state.context.coinFromBalance,
  coinTo: (state: SwapMachineState) => state.context.coinTo,
  toBalance: (state: SwapMachineState) => state.context.coinToBalance,
};

// TODO: check useCoinInput on CoinInput to find missing pieces
export function useSwapCoinSelector(
  direction: SwapDirection
): CoinSelectorProps {
  const { service, send } = useSwapContext();
  const isFrom = direction === SwapDirection.fromTo;
  const coinSelector = isFrom ? selectors.coinFrom : selectors.coinTo;
  const coin = useSelector(service, coinSelector);
  const balanceSelector = isFrom ? selectors.fromBalance : selectors.toBalance;
  const balance = useSelector(service, balanceSelector);
  const isETH = useMemo(() => isCoinEth(coin), [coin?.assetId]);

  return {
    coin,
    showBalance: Boolean(balance),
    showMaxButton: Boolean(coin) && Boolean(balance),
    onChange: (item) => {
      send("SELECT_COIN", { data: { direction, coin: item } });
    },
    onSetMaxBalance() {
      send("SET_MAX_VALUE", { data: { direction } });
    },
    ...(isETH && {
      isReadOnly: true,
      tooltip: "Currently, we only support ETH to TOKEN.",
    }),
  };
}
