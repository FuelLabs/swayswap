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
  parseToFormattedNumber,
  ZERO,
} from "../utils";

import type { CoinSelectorProps } from "./CoinSelector";

import { DECIMAL_UNITS } from "~/config";
import type { NumberInputProps } from "~/systems/UI";
import { Spinner } from "~/systems/UI";
import type { Coin, Maybe } from "~/types";

type UseCoinParams = {
  /**
   * Props for <CoinInput />
   */
  amount?: Maybe<bigint>;
  coin?: Maybe<Coin>;
  gasFee?: Maybe<bigint>;
  isReadOnly?: boolean;
  onInput?: (...args: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange?: (val: Maybe<bigint>) => void;
  /**
   * Coins for <CoinSelector />
   */
  showBalance?: boolean;
  showMaxButton?: boolean;
  onChangeCoin?: (coin: Coin) => void;
  disableWhenEth?: boolean;
};

export type UseCoinInput = {
  amount: Maybe<bigint>;
  setAmount: React.Dispatch<React.SetStateAction<Maybe<bigint>>>;
  setGasFee: React.Dispatch<React.SetStateAction<Maybe<bigint>>>;
  getInputProps: () => CoinInputProps;
  getCoinSelectorProps: () => CoinSelectorProps;
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

const formatValue = (amount: Maybe<bigint>) => {
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
  showBalance,
  showMaxButton,
  onChangeCoin,
  disableWhenEth,
  ...params
}: UseCoinParams): UseCoinInput {
  const [amount, setAmount] = useState<Maybe<bigint>>(null);
  const [gasFee, setGasFee] = useState<Maybe<bigint>>(initialGasFee || ZERO);
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
      showBalance,
      showMaxButton,
      onChange: onChangeCoin,
      onSetMaxBalance: () => {
        onInput?.();
        handleInputPropsChange(formatValue(getSafeMaxBalance()));
      },
      ...(disableWhenEth &&
        isEth && {
          isReadOnly: true,
          tooltip: "Currently, we only support ETH to TOKEN.",
        }),
    } as CoinSelectorProps;
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
    formatted: formatValue(amount),
    hasEnoughBalance: getSafeMaxBalance() >= (amount || ZERO),
  };
}

function getRightValue(value: string, displayType: string) {
  if (displayType === "text") return parseToFormattedNumber(value);
  return value === "0.0" ? "0" : value;
}

type CoinInputProps = Omit<UseCoinParams, "onChange"> &
  NumberInputProps & {
    value: string;
    displayType: DisplayType;
    autoFocus?: boolean;
    isLoading?: boolean;
    rightElement?: ReactNode;
    isAllowed?: (values: NumberFormatValues) => boolean;
    onChange?: (val: string) => void;
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
            value={getRightValue(value || "", displayType)}
            displayType={displayType}
            isAllowed={isAllowed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange?.(e.target.value);
              setValue(e.target.value);
            }}
            decimalScale={DECIMAL_UNITS}
            placeholder="0"
            className="coinInput--input"
            thousandSeparator={false}
            onInput={onInput}
          />
        )}
        {rightElement}
      </div>
    );
  }
);
