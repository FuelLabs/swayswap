import { useSelector } from "@xstate/react";

import type { SwapMachineState } from "../machines/swapMachine";
import { SwapDirection } from "../types";
import { calculatePriceImpact, calculatePriceWithSlippage } from "../utils";

import { useSwapContext } from "./useSwap";

import { useSlippage } from "~/systems/Core";
import { bn, format } from "fuels";

const selectors = {
  hasPreview: (state: SwapMachineState) => {
    return !state.hasTag("loading") && state.context?.previewInfo;
  },
  outputAmount: (state: SwapMachineState) => {
    const ctx = state.context;
    const amount = bn(ctx?.toAmount?.raw);
    return format(amount);
  },
  inputAmount: (state: SwapMachineState) => {
    const ctx = state.context;
    const isFrom = ctx?.direction === SwapDirection.fromTo;
    const amount = bn((isFrom ? ctx?.toAmount : ctx?.fromAmount)?.raw);
    const price = calculatePriceWithSlippage(
      amount,
      ctx?.direction,
      ctx?.slippage || 0
    );
    return format(price);
  },
  priceImpact: (state: SwapMachineState) => {
    const ctx = state.context;
    return ctx && calculatePriceImpact(ctx);
  },
};

export function useSwapPreview() {
  const { service } = useSwapContext();
  const hasPreview = useSelector(service, selectors.hasPreview);
  const outputAmount = useSelector(service, selectors.outputAmount);
  const inputAmount = useSelector(service, selectors.inputAmount);
  const priceImpact = useSelector(service, selectors.priceImpact);
  const slippage = useSlippage();

  return {
    hasPreview,
    outputAmount,
    inputAmount,
    priceImpact,
    slippage,
  };
}
