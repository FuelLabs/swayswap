import { useSelector } from "@xstate/react";
import type React from "react";
import { useEffect, useRef } from "react";
import type { NumberFormatValues } from "react-number-format";

import type { SwapMachineState } from "../machines/swapMachine";
import { FROM_TO, TO_FROM } from "../machines/swapMachine";
import type { SwapDirection } from "../types";

import { useSwapContext } from "./useSwap";

import type { CoinInputProps } from "~/systems/Core";
import { MAX_U64_VALUE, parseInputValueBigInt } from "~/systems/Core";

const selectors = {
  activeDir: ({ context: ctx }: SwapMachineState) => {
    return ctx.direction;
  },
  fromAmount: ({ context: ctx }: SwapMachineState) => {
    return ctx.fromAmount?.value || "";
  },
  toAmount: ({ context: ctx }: SwapMachineState) => {
    return ctx.toAmount?.value || "";
  },
  isDisabled: (dir: SwapDirection) => (state: SwapMachineState) => {
    const { coinFrom, coinTo } = state.context;
    return (dir === FROM_TO && !coinFrom) || (dir === TO_FROM && !coinTo);
  },
  isLoading: (dir: SwapDirection) => (state: SwapMachineState) => {
    const { direction, fromAmount, toAmount, coinFrom, coinTo } = state.context;
    const amount = direction === FROM_TO ? fromAmount?.raw : toAmount?.raw;
    const hasCoins = Boolean(coinFrom && coinTo);
    return Boolean(
      hasCoins && state.hasTag("loading") && dir !== direction && amount
    );
  },
};

type UseCoinInputReturn = CoinInputProps & {
  ref: React.ForwardedRef<HTMLInputElement>;
};

export function useSwapCoinInput(direction: SwapDirection): UseCoinInputReturn {
  const { service, send } = useSwapContext();
  const ref = useRef<HTMLInputElement | null>(null);
  const isFrom = direction === FROM_TO;
  const amountSelector = isFrom ? selectors.fromAmount : selectors.toAmount;
  const coinAmount = useSelector(service, amountSelector);
  const activeDir = useSelector(service, selectors.activeDir);
  const isDisabled = useSelector(service, selectors.isDisabled(direction));
  const isLoading = useSelector(service, selectors.isLoading(direction));

  const isAllowed = ({ value: val }: NumberFormatValues) => {
    return parseInputValueBigInt(val).toNumber() <= MAX_U64_VALUE;
  };

  function onChange(value: string) {
    send({ type: "INPUT_CHANGE", data: { direction, value } });
  }

  useEffect(() => {
    if (!isDisabled && activeDir === direction) {
      ref.current?.focus();
    }
  }, [activeDir, isDisabled]);

  return {
    ref,
    isAllowed,
    onChange,
    isLoading,
    value: coinAmount,
    displayType: "input",
    disabled: isDisabled,
    ...(isDisabled && { placeholder: "Select..." }),
  };
}
