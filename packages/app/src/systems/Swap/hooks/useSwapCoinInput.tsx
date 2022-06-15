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
  activeDir: (state: SwapMachineState) => state.context.direction,
  fromAmount: (state: SwapMachineState) =>
    state.context.fromAmount?.value || "",
  toAmount: (state: SwapMachineState) => state.context.toAmount?.value || "",
  isDisabled: (dir: SwapDirection) => (state: SwapMachineState) => {
    const { coinFrom, coinTo } = state.context;
    return (dir === FROM_TO && !coinFrom) || (dir === TO_FROM && !coinTo);
  },
};

type UseCoinInputReturn = CoinInputProps & {
  ref: React.ForwardedRef<HTMLInputElement>;
};

// TODO: check useCoinInput on CoinInput to find missing pieces
export function useSwapCoinInput(direction: SwapDirection): UseCoinInputReturn {
  const { service, send } = useSwapContext();
  const ref = useRef<HTMLInputElement | null>(null);
  const isFrom = direction === FROM_TO;
  const coinAmount = useSelector(
    service,
    isFrom ? selectors.fromAmount : selectors.toAmount
  );
  const activeDir = useSelector(service, selectors.activeDir);
  const isDisabled = useSelector(service, selectors.isDisabled(direction));

  const isAllowed = ({ value: val }: NumberFormatValues) => {
    return parseInputValueBigInt(val) <= MAX_U64_VALUE;
  };

  function onChange(value: string) {
    send({ type: "SET_INPUT_VALUE", data: { direction, value } });
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
    value: coinAmount,
    displayType: "input",
    disabled: isDisabled,
    "aria-label": `Coin ${isFrom ? "from" : "to"} amount`,
    ...(isDisabled && { placeholder: "Select..." }),
  };
}
