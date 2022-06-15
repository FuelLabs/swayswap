import { useSelector } from "@xstate/react";

import type { SwapMachineState } from "../machines/swapMachine";
import { SwapDirection } from "../types";
import { calculatePriceImpact, calculatePriceWithSlippage } from "../utils";

import { useSwapContext } from "./useSwap";

import { parseToFormattedNumber, useSlippage, ZERO } from "~/systems/Core";

const selectors = {
  hasPreview: (state: SwapMachineState) => {
    return !state.hasTag("loading") && state.context.previewInfo;
  },
  outputAmount: ({ context: ctx }: SwapMachineState) => {
    const amount = ctx.toAmount?.raw || ZERO;
    return parseToFormattedNumber(amount);
  },
  inputAmount: ({ context: ctx }: SwapMachineState) => {
    const isFrom = ctx.direction === SwapDirection.fromTo;
    const amount = (isFrom ? ctx.toAmount : ctx.fromAmount)?.raw || ZERO;
    const price = calculatePriceWithSlippage(
      amount,
      ctx.direction,
      ctx.slippage || 0
    );
    return parseToFormattedNumber(price);
  },
  priceImpact: ({ context: ctx }: SwapMachineState) => {
    return calculatePriceImpact(ctx);
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
