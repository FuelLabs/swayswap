import { formatUnits, parseUnits } from "ethers/lib/utils";
import { toBigInt } from "fuels";
import { forwardRef, useEffect, useState } from "react";
import type { NumberFormatValues } from "react-number-format";
import NumberFormat from "react-number-format";

import { Button } from "./Button";
import { CoinSelector } from "./CoinSelector";

import { DECIMAL_UNITS } from "~/config";
import { useBalances } from "~/hooks/useBalances";
import type { Coin } from "~/types";

// Max value supported
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const MAX_U64_VALUE = 0xffff_ffff_ffff_ffff;

const style = {
  transferPropContainer: `flex bg-gray-700 rounded-2xl p-2 border border-gray-700`,
  input: `mx-2 h-10 bg-transparent placeholder:text-gray-300 outline-none text-xl flex items-center`,
  rightWrapper: `flex flex-1 flex-col items-end`,
  maxButton: `text-xs py-0 px-1 h-auto bg-primary-800/60 text-primary-500 hover:bg-primary-800`,
};

type UseCoinParams = {
  amount?: bigint | null;
  isReadOnly?: boolean;
  coinSelectorDisabled?: boolean;
  coin?: Coin | null;
  gasFee?: bigint;
  showBalance?: boolean;
  onInput?: (...args: any) => void;
  onChange?: (val: bigint | null) => void;
  onChangeCoin?: (value: Coin) => void;
};

type DisplayType = "input" | "text";

type CoinInputParameters = UseCoinParams & {
  value: string;
  balance?: string;
  displayType: DisplayType;
  isReadOnly?: boolean;
  coinSelectorDisable?: boolean;
  showBalance?: boolean;
  showMaxButton?: boolean;
  autoFocus?: boolean;
  isAllowed?: (values: NumberFormatValues) => boolean;
  onChange?: (val: string) => void;
  setMaxBalance?: () => void;
};

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
  isReadOnly,
  showBalance = true,
  coin,
  gasFee,
  onInput,
  ...params
}: UseCoinParams) {
  const [amount, setAmount] = useState<bigint | null>(null);
  const { data: balances } = useBalances({ enabled: showBalance });
  const coinBalance = balances?.find((item) => item.assetId === coin?.assetId);

  useEffect(() => {
    // Enable value initialAmount to be null
    if (initialAmount !== undefined) setAmount(initialAmount);
  }, [initialAmount]);

  // TODO: consider real gas fee, replacing GAS_FEE variable.
  // For now we need to keep 1 unit in the wallet(it's not spent) in order to complete "create pool" transaction.
  function getSafeMaxBalance() {
    const next = coinBalance?.amount || BigInt(0);
    return next > BigInt(0) ? next - (gasFee || BigInt(0)) : next;
  }

  function getInputProps() {
    return {
      ...params,
      coin,
      isReadOnly,
      value: formatValue(amount),
      displayType: (isReadOnly ? "text" : "input") as DisplayType,
      onInput,
      onChange: (val: string) => {
        if (isReadOnly) return;
        const next = val !== "" ? parseValueBigInt(val) : null;
        if (typeof onChange === "function") {
          onChange(next);
        } else {
          setAmount(next);
        }
      },
      isAllowed: ({ value }: NumberFormatValues) =>
        parseValueBigInt(value) <= MAX_U64_VALUE,
      setMaxBalance: () => {
        onInput?.();
        setAmount(getSafeMaxBalance());
      },
      balance: formatValue(coinBalance?.amount || BigInt(0)),
      showBalance,
      showMaxButton: showBalance,
    } as CoinInputParameters;
  }

  return {
    amount,
    formatted: formatValue(amount),
    setAmount,
    getInputProps,
    hasEnoughBalance: getSafeMaxBalance() >= (amount || BigInt(0)),
  };
}

export const CoinInput = forwardRef<HTMLInputElement, CoinInputParameters>(
  (
    {
      value: initialValue,
      displayType,
      onChange,
      coin,
      isAllowed,
      onChangeCoin,
      onInput,
      isReadOnly,
      coinSelectorDisabled,
      showMaxButton,
      showBalance,
      setMaxBalance,
      balance,
      autoFocus,
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
        <NumberFormat
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
        <div className={style.rightWrapper}>
          <CoinSelector
            value={coin}
            onChange={onChangeCoin}
            isReadOnly={isReadOnly || coinSelectorDisabled}
          />
          {(showBalance || showMaxButton) && (
            <div className="flex items-center gap-2 mt-2">
              {showBalance && (
                <div className="text-xs text-gray-400">Balance: {balance}</div>
              )}
              {showMaxButton && (
                <Button
                  size="sm"
                  onPress={setMaxBalance}
                  className={style.maxButton}
                  variant="ghost"
                >
                  Max
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
