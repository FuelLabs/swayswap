import { useSelector } from "@xstate/react";
import { useState } from "react";

import type { SwapMachineState } from "../machines/swapMachine";
import { SwapDirection } from "../types";
import { getPricePerToken } from "../utils";

import { useSwapContext } from "./useSwap";

import { ZERO } from "~/systems/Core";

const selectors = {
  hasPreview: (state: SwapMachineState) => {
    return !state.hasTag("loading") && state.context.previewInfo;
  },
  coinFrom: ({ context: ctx }: SwapMachineState) => {
    return {
      symbol: ctx.coinFrom?.symbol || "",
      amount: ctx.fromAmount?.raw || ZERO,
    };
  },
  coinTo: ({ context: ctx }: SwapMachineState) => {
    return {
      symbol: ctx.coinTo?.symbol || "",
      amount: ctx.toAmount?.raw || ZERO,
    };
  },
  isFrom: ({ context: ctx }: SwapMachineState) => {
    return ctx.direction === SwapDirection.fromTo;
  },
};

export function usePricePerToken() {
  const { service } = useSwapContext();
  const hasPreview = useSelector(service, selectors.hasPreview);
  const coinFrom = useSelector(service, selectors.coinFrom);
  const coinTo = useSelector(service, selectors.coinTo);
  const isFrom = useSelector(service, selectors.isFrom);
  const assets = isFrom ? [coinFrom, coinTo] : [coinTo, coinFrom];

  const [revert, setRevert] = useState(false);
  const assetFrom = revert ? assets[1] : assets[0];
  const assetTo = revert ? assets[0] : assets[1];
  const pricePerToken = getPricePerToken(assetFrom.amount, assetTo.amount);

  function onToggleAssets() {
    setRevert((s) => !s);
  }

  return {
    hasPreview,
    pricePerToken,
    onToggleAssets,
    assetFrom,
    assetTo,
  };
}
