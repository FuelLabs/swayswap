import type { ReactNode } from "react";
import { useMemo, forwardRef, useEffect, useState } from "react";
import type { NumberFormatValues } from "react-number-format";
import NumberFormat from "react-number-format";

import { useBalances } from "../hooks";
import {
  COIN_ETH,
  formatUnits,
  parseUnits,
  toBigInt,
  MAX_U64_VALUE,
  ZERO,
} from "../utils";

import type { CoinBalanceProps } from "./CoinBalance";
import type { CoinSelectorProps } from "./CoinSelector";

import { DECIMAL_UNITS } from "~/config";
import type { NumberInputProps } from "~/systems/UI";
import { Spinner } from "~/systems/UI";
import type { Coin } from "~/types";

type UseCoinParams = {
  /**
   * Props for <CoinInput />
   */
  amount?: bigint | null;
  coin?: Coin | null;
  gasFee?: bigint | null;
  isReadOnly?: boolean;
  onInput?: (...args: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange?: (val: bigint | null) => void;
  /**
   * Coins for <CoinSelector />
   */
  onChangeCoin?: (coin: Coin) => void;
  disableWhenEth?: boolean;
};

export type UseCoinInput = {
  amount: bigint | null;
  setAmount: React.Dispatch<React.SetStateAction<bigint | null>>;
  setGasFee: React.Dispatch<React.SetStateAction<bigint | null>>;
  getInputProps: () => CoinInputProps;
  getCoinSelectorProps: () => CoinSelectorProps;
  getCoinBalanceProps: () => CoinBalanceProps;
  formatted: string;
  hasEnoughBalance: boolean;
};

type DisplayType = "input" | "text";

const parseValue = (value: string) => (value === "." ? "0." : value);

const parseValueBigInt = (value: string) => {
  if (value !== "") {
    const nextValue = parseValue(value);
    return toBigInt(parseUnits(nextValue));
  }
  return ZERO;
};

const formatValue = (amount: bigint | null | undefined) => {
  if (amount != null) {
    return formatUnits(amount);
  }
  // If amount is null return empty string
  return "";
};

export function useCoinInput({
  amount: initialAmount,
  onChange,
  coin,
  gasFee: initialGasFee,
  isReadOnly,
  onInput,
  onChangeCoin,
  disableWhenEth,
  ...params
}: UseCoinParams): UseCoinInput {
  const [amount, setAmount] = useState<bigint | null>(null);
  const [gasFee, setGasFee] = useState<bigint | null>(initialGasFee || ZERO);
  const { data: balances } = useBalances();
  const coinBalance = balances?.find((item) => item.assetId === coin?.assetId);
  const isEth = useMemo(() => coin?.assetId === COIN_ETH, [coin?.assetId]);

  useEffect(() => {
    if (initialGasFee) setGasFee(initialGasFee);
  }, [initialGasFee]);

  // TODO: consider real gas fee, replacing GAS_FEE variable.
  // For now we need to keep 1 unit in the wallet(it's not spent) in order to complete "create pool" transaction.
  function getSafeMaxBalance() {
    const next = coinBalance?.amount || ZERO;
    const value = next > ZERO ? next - (gasFee || ZERO) : next;
    if (value < ZERO) return ZERO;
    return value;
  }

  const handleInputPropsChange = (val: string) => {
    if (isReadOnly) return;
    const next = val !== "" ? parseValueBigInt(val) : null;
    if (typeof onChange === "function") {
      onChange(next);
    } else {
      setAmount(next);
    }
  };

  const isAllowed = ({ value }: NumberFormatValues) =>
    parseValueBigInt(value) <= MAX_U64_VALUE;

  function getInputProps() {
    return {
      ...params,
      value: formatValue(amount),
      displayType: (isReadOnly ? "text" : "input") as DisplayType,
      onInput,
      onChange: handleInputPropsChange,
      balance: formatValue(coinBalance?.amount || ZERO),
      isAllowed,
    } as CoinInputProps;
  }

  function getCoinSelectorProps() {
    return {
      coin,
      isReadOnly,
      onChange: onChangeCoin,
      ...(disableWhenEth &&
        isEth && {
          isReadOnly: true,
          tooltip: "Currently, we only support ETH <-> TOKEN.",
        }),
    } as CoinSelectorProps;
  }

  function getCoinBalanceProps() {
    return {
      coin,
      gasFee,
      onSetMaxBalance: () => {
        onInput?.();
        handleInputPropsChange(formatValue(getSafeMaxBalance()));
      },
    } as CoinBalanceProps;
  }

  useEffect(() => {
    // Enable value initialAmount to be null
    if (initialAmount !== undefined) setAmount(initialAmount);
  }, [initialAmount]);

  return {
    amount,
    setAmount,
    setGasFee,
    getInputProps,
    getCoinSelectorProps,
    getCoinBalanceProps,
    formatted: formatValue(amount),
    hasEnoughBalance: getSafeMaxBalance() >= (amount || ZERO),
  };
}

function getRightValue(value: string) {
  if (process.env.NODE_ENV === "test" && !value) return null;
  if (value === "0.0") return "0";
  if (value === ".") return "0.";
  return value;
}

type CoinInputProps = Omit<UseCoinParams, "onChange"> &
  NumberInputProps & {
    value: string;
    displayType: DisplayType;
    autoFocus?: boolean;
    isLoading?: boolean;
    isAllowed?: (values: NumberFormatValues) => boolean;
    onChange?: (val: string) => void;
    rightElement?: ReactNode;
    bottomElement?: ReactNode;
  };

export const CoinInput = forwardRef<HTMLInputElement, CoinInputProps>(
  (
    {
      value: initialValue,
      displayType,
      onChange,
      isAllowed,
      onInput,
      autoFocus,
      isLoading,
      rightElement,
      bottomElement,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState<string | undefined>(initialValue);

    useEffect(() => {
      // Enable to clean field using empty string
      if (initialValue != null) {
        setValue(initialValue);
      }
    }, [initialValue]);

    return (
      <div className="coinInput">
        <div className="flex">
          {isLoading ? (
            <div className="flex-1">
              <Spinner className="self-start mt-2 ml-2" variant="base" />
            </div>
          ) : (
            <NumberFormat
              {...props}
              autoFocus={autoFocus}
              getInputRef={ref}
              allowNegative={false}
              defaultValue={initialValue}
              value={getRightValue(value || "")}
              displayType={displayType}
              isAllowed={isAllowed}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange?.(e.target.value);
                setValue(e.target.value);
              }}
              decimalScale={displayType === "text" ? 4 : DECIMAL_UNITS}
              placeholder="0"
              className="coinInput--input"
              thousandSeparator={false}
              onInput={onInput}
            />
          )}
          {rightElement}
        </div>
        {bottomElement}
      </div>
    );
  }
);
