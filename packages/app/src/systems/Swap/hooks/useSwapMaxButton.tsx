import { useSelector } from "@xstate/react";
import { bn } from "fuels";

import type { SwapMachineState } from "../machines/swapMachine";
import type { SwapMachineContext } from "../types";
import { SwapDirection } from "../types";
import { calculateMaxBalanceToSwap } from "../utils";

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
    return balance && balance.gt(bn(0));
  },
  isMaxButtonDisabled: (dir: SwapDirection) => (state: SwapMachineState) => {
    const { txCost, ethBalance } = state.context;
    if (!txCost?.fee || !ethBalance) return;

    const balance = getRightBalance(dir, state.context);

    const isFrom = dir === SwapDirection.fromTo;
    const coinAmount = isFrom
      ? state.context.fromAmount?.value
      : state.context.toAmount?.value;
    const maxBalanceToSwap = calculateMaxBalanceToSwap({
      direction: dir,
      ctx: state.context,
    });
    const isInputWithMaxBalance = maxBalanceToSwap.value === coinAmount;

    return isInputWithMaxBalance || !balance || txCost.fee > ethBalance;
  },
  getMaxBalanceToSwap: (dir: SwapDirection) => (state: SwapMachineState) =>
    calculateMaxBalanceToSwap({ direction: dir, ctx: state.context }),
};

export function useSwapMaxButton(direction: SwapDirection): CoinSelectorProps {
  const { service, send } = useSwapContext();
  const isFrom = direction === SwapDirection.fromTo;
  const coinSelector = isFrom ? selectors.coinFrom : selectors.coinTo;
  const coin = useSelector(service, coinSelector);
  const gasFee = useSelector(service, selectors.gasFee);
  const hasBalance = useSelector(service, selectors.hasBalance(direction));
  const isMaxButtonDisabled = useSelector(
    service,
    selectors.isMaxButtonDisabled(direction)
  );

  return {
    coin,
    gasFee,
    showBalance: Boolean(hasBalance),
    showMaxButton: Boolean(hasBalance) && isFrom,
    onSetMaxBalance: () => {
      send("SET_MAX_VALUE", { data: { direction } });
    },
    isMaxButtonDisabled,
  } as CoinBalanceProps;
}
