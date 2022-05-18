import { toBigInt } from "fuels";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect } from "react";
import { useState } from "react";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { DECIMAL_UNITS } from "src/config";
import { CoinSelector } from "./CoinSelector";

// Max value supported
const MAX_U64_VALUE = 0xffff_ffff_ffff_ffff;

const style = {
  transferPropContainer: `flex items-center bg-[#20242A] rounded-2xl p-2 text-3xl border border-[#20242A]`,
  inputWrapper: `flex flex-1 items-center px-2`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none text-2xl`,
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
};

type DisplayType = "input" | "text";

type CoinInputParameters = UseCoinParams & {
  value: string;
  displayType: DisplayType;
  isAllowed?: (values: NumberFormatValues) => boolean;
  onChange?: (val: string) => void;
  isReadOnly?: boolean;
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

export function useCoinInput({
  disabled,
  amount: initialAmount,
  onChange,
  ...params
}: UseCoinParams) {
  const [amount, setAmount] = useState<bigint | null>(null);

  useEffect(() => {
    if (initialAmount != null) setAmount(initialAmount);
  }, [initialAmount]);

  function getInputProps() {
    return {
      ...params,
      value: formatValue(amount),
      displayType: (disabled ? "text" : "input") as DisplayType,
      onChange: (val: string) => {
        if (disabled) return;
        onChange?.(val !== "" ? parseValueBigInt(val) : null);
      },
      isAllowed: ({ value }: NumberFormatValues) => {
        return parseValueBigInt(value) <= MAX_U64_VALUE;
      },
    } as CoinInputParameters;
  }

  return {
    amount,
    formatted: formatValue(amount),
    setAmount,
    getInputProps,
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
}: CoinInputParameters) {
  const [value, setValue] = useState<string | undefined>(initialValue);

  useEffect(() => {
    if (initialValue) setValue(initialValue);
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
          onValueChange={(e) => {
            onChange?.(e.value);
            setValue(e.value);
          }}
          decimalScale={DECIMAL_UNITS}
          placeholder="0"
          className={style.transferPropInput}
          thousandSeparator={false}
          onInput={onInput}
        />
      </div>
      <CoinSelector
        coins={coins}
        value={coin}
        onChange={onChangeCoin}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
