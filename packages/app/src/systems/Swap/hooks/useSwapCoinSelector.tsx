import { useSelector } from "@xstate/react";
import { useMemo } from "react";

import type { SwapMachineState } from "../machines/swapMachine";
import type { SwapMachineContext } from "../types";
import { SwapDirection } from "../types";

import { useSwapContext } from "./useSwap";

import type { CoinSelectorProps } from "~/systems/Core";
import { isCoinEth } from "~/systems/Core";

function getRightBalance(dir: SwapDirection, ctx: SwapMachineContext) {
  const { coinFromBalance, coinToBalance } = ctx;
  const isFrom = dir === SwapDirection.fromTo;
  return isFrom ? coinFromBalance : coinToBalance;
}

const selectors = {
  coinFrom: (state: SwapMachineState) => state.context.coinFrom,
  coinTo: (state: SwapMachineState) => state.context.coinTo,
  hasBalance: (dir: SwapDirection) => (state: SwapMachineState) => {
    const balance = getRightBalance(dir, state.context);
    return balance && balance > 0;
  },
  showMaxButton: (dir: SwapDirection) => (state: SwapMachineState) => {
    const { txCost, ethBalance } = state.context;
    if (!txCost?.total || !ethBalance) return;
    const balance = getRightBalance(dir, state.context);
    return balance && balance > 0 && ethBalance > txCost.total;
  },
};

// TODO: check useCoinInput on CoinInput to find missing pieces
export function useSwapCoinSelector(
  direction: SwapDirection
): CoinSelectorProps {
  const { service, send } = useSwapContext();
  const isFrom = direction === SwapDirection.fromTo;
  const coinSelector = isFrom ? selectors.coinFrom : selectors.coinTo;
  const coin = useSelector(service, coinSelector);
  const isETH = useMemo(() => isCoinEth(coin), [coin?.assetId]);
  const hasBalance = useSelector(service, selectors.hasBalance(direction));
  const showMaxButton = useSelector(
    service,
    selectors.showMaxButton(direction)
  );

  return {
    coin,
    showBalance: Boolean(hasBalance),
    showMaxButton: Boolean(showMaxButton),
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
