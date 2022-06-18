import { useSelector } from "@xstate/react";

import type { SwapMachineState } from "../machines/swapMachine";
import type { SwapMachineContext } from "../types";
import { SwapDirection } from "../types";

import { useSwapContext } from "./useSwap";

import type { CoinBalanceProps, CoinSelectorProps } from "~/systems/Core";
import { safeBigInt } from "~/systems/Core";

function getRightBalance(dir: SwapDirection, ctx: SwapMachineContext) {
  const { coinFromBalance, coinToBalance } = ctx;
  const isFrom = dir === SwapDirection.fromTo;
  return isFrom ? coinFromBalance : coinToBalance;
}

const selectors = {
  coinFrom: (state: SwapMachineState) => {
    return state.context.coinFrom;
  },
  coinTo: (state: SwapMachineState) => {
    return state.context.coinTo;
  },
  gasFee: (state: SwapMachineState) => {
    return safeBigInt(state.context.txCost?.total);
  },
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

export function useSwapMaxButton(direction: SwapDirection): CoinSelectorProps {
  const { service, send } = useSwapContext();
  const isFrom = direction === SwapDirection.fromTo;
  const coinSelector = isFrom ? selectors.coinFrom : selectors.coinTo;
  const coin = useSelector(service, coinSelector);
  const gasFee = useSelector(service, selectors.gasFee);
  const hasBalance = useSelector(service, selectors.hasBalance(direction));
  const maxButtonSelector = selectors.showMaxButton(direction);
  const showMaxButton = useSelector(service, maxButtonSelector);

  return {
    coin,
    gasFee,
    showBalance: Boolean(hasBalance),
    showMaxButton: Boolean(showMaxButton),
    onSetMaxBalance: () => {
      send("SET_MAX_VALUE", { data: { direction } });
    },
  } as CoinBalanceProps;
}
