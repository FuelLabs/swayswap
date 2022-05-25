import { formatUnits, parseUnits } from "ethers/lib/utils";
import { toBigInt } from "fuels";
import type { ReactNode } from "react";
import { useMemo, forwardRef, useEffect, useState } from "react";
import type { NumberFormatValues } from "react-number-format";
import NumberFormat from "react-number-format";

import type { CoinSelectorProps } from "./CoinSelector";
import type { NumberInputProps } from "./NumberInput";
import { Spinner } from "./Spinner";

import { DECIMAL_UNITS, MAX_U64_VALUE } from "~/config";
import { useBalances } from "~/hooks/useBalances";
import { COIN_ETH } from "~/lib/constants";
import type { Coin } from "~/types";

const style = {
  transferPropContainer: `flex bg-gray-700 rounded-2xl p-2 border border-gray-700`,
  input: `mx-2 h-10 bg-transparent placeholder:text-gray-300 outline-none text-xl flex items-center`,
  rightWrapper: `flex flex-1 flex-col items-end`,
  maxButton: `text-xs py-0 px-1 h-auto bg-primary-800/60 text-primary-500 hover:bg-primary-800`,
};

type UseCoinParams = {
  /**
   * Props for <CoinInput />
   */
  amount?: bigint | null;
  coin?: Coin | null;
  gasFee?: bigint;
  isReadOnly?: boolean;
  onInput?: (...args: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange?: (val: bigint | null) => void;
  /**
   * Coins for <CoinSelector />
   */
  showBalance?: boolean;
  showMaxButton?: boolean;
  onChangeCoin?: (coin: Coin) => void;
  disableWhenEth?: boolean;
};

type DisplayType = "input" | "text";

const parseValue = (value: string) => (value === "." ? "0." : value);

const parseValueBigInt = (value: string) => {
  if (value !== "") {
    const nextValue = parseValue(value);
    return parseUnits(nextValue, DECIMAL_UNITS).toBigInt();
  }
  return toBigInt(0);
};

const formatValue = (amount: bigint | null | undefined) => {
  if (amount != null) {
    return formatUnits(amount, DECIMAL_UNITS);
  }
  // If amount is null return empty string
  return "";
};

export function useCoinInput({
  amount: initialAmount,
  onChange,
  coin,
  gasFee,
  isReadOnly,
  onInput,
  showBalance,
  showMaxButton,
  onChangeCoin,
  disableWhenEth,
  ...params
}: UseCoinParams) {
  const [amount, setAmount] = useState<bigint | null>(null);
  const { data: balances } = useBalances();
  const coinBalance = balances?.find((item) => item.assetId === coin?.assetId);
  const isEth = useMemo(() => coin?.assetId === COIN_ETH, [coin?.assetId]);

  // TODO: consider real gas fee, replacing GAS_FEE variable.
  // For now we need to keep 1 unit in the wallet(it's not spent) in order to complete "create pool" transaction.
  function getSafeMaxBalance() {
    const next = coinBalance?.amount || BigInt(0);
    return next > BigInt(0) ? next - (gasFee || BigInt(0)) : next;
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

  function getInputProps() {
    return {
      ...params,
      coin,
      value: formatValue(amount),
      displayType: (isReadOnly ? "text" : "input") as DisplayType,
      onInput,
      onChange: handleInputPropsChange,
      balance: formatValue(coinBalance?.amount || BigInt(0)),
      isAllowed: ({ value }: NumberFormatValues) =>
        parseValueBigInt(value) <= MAX_U64_VALUE,
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
    getInputProps,
    getCoinSelectorProps,
    formatted: formatValue(amount),
    hasEnoughBalance: getSafeMaxBalance() >= (amount || BigInt(0)),
  };
}

type CoinInputProps = Omit<UseCoinParams, "onChange"> &
  NumberInputProps & {
    value: string;
    balance?: string;
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
      <div className={style.transferPropContainer}>
        {isLoading ? (
          <Spinner className="self-start mt-2 ml-2" variant="base" />
        ) : (
          <NumberFormat
            {...props}
            autoFocus={autoFocus}
            getInputRef={ref}
            allowNegative={false}
            defaultValue={initialValue}
            value={value}
            displayType={displayType}
            isAllowed={isAllowed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange?.(e.target.value);
              setValue(e.target.value);
            }}
            decimalScale={DECIMAL_UNITS}
            placeholder="0"
            className={style.input}
            thousandSeparator={false}
            onInput={onInput}
          />
        )}
        {rightElement}
      </div>
    );
  }
);
