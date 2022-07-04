import { useSelector } from "@xstate/react";

import type { SwapMachineState } from "../machines/swapMachine";
import type { SwapMachineContext } from "../types";
import { SwapDirection } from "../types";
import { calculateMaxBalanceToSwap } from "../utils";

import { useSwapContext } from "./useSwap";
import { useSwapCoinInput } from "./useSwapCoinInput";

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
    if (!txCost?.fee || !ethBalance) return;
    const balance = getRightBalance(dir, state.context);
    return balance && balance > 0 && ethBalance > txCost.fee;
  },
  getMaxBalanceToSwap: (dir: SwapDirection) => (state: SwapMachineState) =>
    calculateMaxBalanceToSwap({ direction: dir, ctx: state.context }),
};

export function useSwapMaxButton(direction: SwapDirection): CoinSelectorProps {
  const { service, send } = useSwapContext();
  const { value: coinAmount } = useSwapCoinInput(direction);
  const isFrom = direction === SwapDirection.fromTo;
  const coinSelector = isFrom ? selectors.coinFrom : selectors.coinTo;
  const coin = useSelector(service, coinSelector);
  const gasFee = useSelector(service, selectors.gasFee);
  const hasBalance = useSelector(service, selectors.hasBalance(direction));
  const maxButtonSelector = selectors.showMaxButton(direction);
  const showMaxButton = useSelector(service, maxButtonSelector);
  const maxBalanceToSwap = useSelector(
    service,
    selectors.getMaxBalanceToSwap(direction)
  );

  return {
    coin,
    gasFee,
    showBalance: Boolean(hasBalance),
    showMaxButton: Boolean(showMaxButton),
    onSetMaxBalance: () => {
      send("SET_MAX_VALUE", { data: { direction } });
    },
    isMaxButtonDisabled: maxBalanceToSwap.value === coinAmount,
  } as CoinBalanceProps;
}
