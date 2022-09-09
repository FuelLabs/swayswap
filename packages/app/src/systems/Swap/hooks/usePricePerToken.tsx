import { useSelector } from "@xstate/react";
import { useState } from "react";

import type { SwapMachineState } from "../machines/swapMachine";
import { SwapDirection } from "../types";
import { getPricePerToken } from "../utils";

import { useSwapContext } from "./useSwap";

import { compareStates, safeBigInt } from "~/systems/Core";

const selectors = {
  coinFrom: ({ context: ctx }: SwapMachineState) => {
    return {
      symbol: ctx.coinFrom?.symbol || "",
      amount: safeBigInt(ctx.fromAmount?.raw),
    };
  },
  coinTo: ({ context: ctx }: SwapMachineState) => {
    return {
      symbol: ctx.coinTo?.symbol || "",
      amount: safeBigInt(ctx.toAmount?.raw),
    };
  },
  isFrom: ({ context: ctx }: SwapMachineState) => {
    return ctx.direction === SwapDirection.fromTo;
  },
};

export function usePricePerToken() {
  const { service } = useSwapContext();
  const coinFrom = useSelector(service, selectors.coinFrom, compareStates);
  const coinTo = useSelector(service, selectors.coinTo, compareStates);
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
    pricePerToken,
    onToggleAssets,
    assetFrom,
    assetTo,
  };
}
