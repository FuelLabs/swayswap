import { useSelector } from "@xstate/react";

import type { SwapMachineState } from "../machines/swapMachine";
import { FROM_TO, TO_FROM, isLoadingState } from "../machines/swapMachine";

import { useSwap, useSwapContext } from "./useSwap";

const selectors = {
  buttonText: (state: SwapMachineState) => {
    const ctx = state.context;
    const coinFrom = ctx?.coinFrom;

    if (isLoadingState(state)) {
      return "Loading...";
    }
    if (state.hasTag("isSwapping")) {
      return "Swapping...";
    }
    if (state.hasTag("needSelectToken")) {
      const opposite = ctx?.direction === FROM_TO ? TO_FROM : FROM_TO;
      return `Select ${opposite} token`;
    }
    if (state.hasTag("noPoolFound")) {
      return "No pool found";
    }
    if (state.hasTag("notHasCoinFromBalance")) {
      return `Insufficient ${coinFrom?.name || ""} balance`;
    }
    if (state.hasTag("notHasLiquidity")) {
      return "Insufficient Liquidity";
    }
    if (state.hasTag("notHasEthForNetworkFee")) {
      return "Insufficient ETH for gas";
    }
    if (state.hasTag("canSwap")) {
      return "Swap";
    }
    return "Enter amount";
  },
  canSwap: (state: SwapMachineState) => {
    return state.hasTag("canSwap");
  },
};

export function useSwapButton() {
  const { service } = useSwapContext();
  const { onSwap } = useSwap();
  const text = useSelector(service, selectors.buttonText);
  const canSwap = useSelector(service, selectors.canSwap);

  return {
    text,
    props: {
      isDisabled: !canSwap,
      onPress: onSwap,
    },
  };
}
