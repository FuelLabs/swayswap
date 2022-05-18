import { CoinQuantity, toBigInt } from "fuels";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect } from "react";
import { useState } from "react";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { DECIMAL_UNITS } from "src/config";
import { CoinSelector } from "./CoinSelector";
import { Button } from "./Button";

// Max value supported
const MAX_U64_VALUE = 0xffff_ffff_ffff_ffff;

const style = {
  transferPropContainer: `flex items-center bg-[#20242A] rounded-2xl p-2 border border-[#20242A]`,
  inputWrapper: `flex flex-1 items-center px-2`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none text-xl`,
  rightWrapper: `flex flex-1 flex-col items-end`,
  selectorWrapper: `flex items-center`,
  balanceWrapper: `text-sm text-[#7f8690] mb-1`,
  maxButton: `mr-2`,
};

export interface Coin {
  assetId: string;
  name?: string;
  img?: string;
}

type UseCoinParams = {
  amount?: bigint | null;
  onChange?: (val: bigint | null) => void;
  disabled?: boolean;
  coin?: Coin | null;
  coins?: Coin[];
  onChangeCoin?: (value: Coin) => void;
  onInput?: (...args: any) => void;
  coinBalance?: CoinQuantity;
};

type DisplayType = "input" | "text";

type CoinInputParameters = UseCoinParams & {
  value: string;
  displayType: DisplayType;
  isAllowed?: (values: NumberFormatValues) => boolean;
  onChange?: (val: string) => void;
  isReadOnly?: boolean;
  showMaxButton?: boolean;
  showBalance?: boolean;
  setMaxBalance?: () => void;
  balance?: string;
};

const parseValue = (value: string) => {
  return value === "." ? "0." : value;
};

const parseValueBigInt = (value: string) => {
  if (value !== "") {
    const _value = parseValue(value);
    return parseUnits(_value, DECIMAL_UNITS).toBigInt();
  }
  return toBigInt(0);
};

const formatValue = (amount: bigint | null | undefined) => {
  if (amount != null) {
    return formatUnits(amount, DECIMAL_UNITS);
  } else if (!amount) {
    return "";
  }
};

const GAS_FEE = BigInt(1);

export function useCoinInput({
  disabled,
  amount: initialAmount,
  onChange,
  coinBalance,
  coin,
  ...params
}: UseCoinParams) {
  const [amount, setAmount] = useState<bigint | null>(null);

  useEffect(() => {
    if (initialAmount != null) setAmount(initialAmount);
  }, [initialAmount]);

  // TODO: consider real gas fee, replacing GAS_FEE variable.
  // For now we need to keep 1 unit in the wallet(it's not spent) in order to complete "create pool" transaction.
  function getSafeMaxBalance() {
    const amount = coinBalance?.amount || BigInt(0);

    return (amount > BigInt(0) && coin?.name === 'ETH') ?
      amount - BigInt(1) :
      amount;
  }

  function getInputProps() {
    return {
      ...params,
      coin,
      value: formatValue(amount),
      displayType: (disabled ? "text" : "input") as DisplayType,
      onChange: (val: string) => {
        if (disabled) return;
        const next = val !== "" ? parseValueBigInt(val) : null;
        typeof onChange === "function" ? onChange(next) : setAmount(next);
      },
      isAllowed: ({ value }: NumberFormatValues) => {
        return parseValueBigInt(value) <= MAX_U64_VALUE;
      },
      setMaxBalance: () => {
        setAmount(getSafeMaxBalance());
      },
      balance: formatValue(coinBalance?.amount || BigInt(0)),
    } as CoinInputParameters;
  }

  return {
    amount,
    formatted: formatValue(amount),
    setAmount,
    getInputProps,
    hasEnoughBalance: (getSafeMaxBalance()) >= (amount || BigInt(0))
  };
}

export function CoinInput({
  value: initialValue,
  displayType,
  onChange,
  coin,
  coins,
  isAllowed,
  onChangeCoin,
  onInput,
  isReadOnly,
  showMaxButton,
  showBalance,
  setMaxBalance,
  balance,
}: CoinInputParameters) {
  const [value, setValue] = useState<string | undefined>(initialValue);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <div className={style.transferPropContainer}>
      <div className={style.inputWrapper}>
        <NumberFormat
          allowNegative={false}
          defaultValue={initialValue}
          value={value}
          displayType={displayType}
          isAllowed={isAllowed}
          onChange={(e: any) => {
            onChange?.(e.target.value);
            setValue(e.target.value);
          }}
          decimalScale={DECIMAL_UNITS}
          placeholder="0"
          className={style.transferPropInput}
          thousandSeparator={false}
          onInput={onInput}
        />
      </div>
      <div className={style.rightWrapper}>
        { showBalance && (
          <div className={style.balanceWrapper}>
            Balance: {balance}
          </div>
        )}
        <div className={style.selectorWrapper}>
          {showMaxButton && (
            <Button
              onPress={setMaxBalance}
              className={style.maxButton}
              variant="ghost"
            >
              Max
            </Button>
          )}
          <CoinSelector
            coins={coins}
            value={coin}
            onChange={onChangeCoin}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
}
