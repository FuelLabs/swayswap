import cx from "classnames";
import { forwardRef, useState, useEffect, useCallback } from "react";
import NumberFormat from "react-number-format";

import type { CoinInputProps } from "../hooks/useCoinInput";

import { DECIMAL_UNITS } from "~/config";
import { ZERO_AMOUNT } from "~/systems/Swap/utils";
import { Spinner } from "~/systems/UI";

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
      className,
      ...props
    },
    ref
  ) => {
    const [displayedCoinValue, setDisplayedCoinValue] = useDisplayedCoins(
      initialValue,
      onChange
    );

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
              className={cx(className, "coinInput--input")}
              autoFocus={autoFocus}
              inputMode={"decimal"}
              getInputRef={ref}
              allowNegative={false}
              value={displayedCoinValue}
              displayType={displayType}
              isAllowed={isAllowed}
              onInput={onInput}
              decimalScale={displayType === "text" ? 4 : DECIMAL_UNITS}
              placeholder={props.placeholder || "0"}
              allowedDecimalSeparators={[".", ","]}
              thousandSeparator={false}
              onChange={setDisplayedCoinValue}
            />
          )}
          {rightElement}
        </div>
        {bottomElement}
      </div>
    );
  }
);

function useDisplayedCoins(
  initialValue: string,
  onChange: CoinInputProps["onChange"]
): [string, (e: React.ChangeEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (value !== initialValue) onChange?.(value);
  }, [value]);

  useEffect(() => {
    if (parseFloat(value) === 0 && initialValue === ZERO_AMOUNT.value) return;
    setValue(initialValue);
  }, [initialValue]);

  const valueSetter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.value.startsWith(".")) {
        setValue("0.");
        return;
      }

      const hasLeadingZeros = e.currentTarget.value.match(/^0+\d/) != null;

      if (hasLeadingZeros) {
        const valueWithoutLeadingZeros = parseFloat(
          e.currentTarget.value
        ).toString();
        setValue(valueWithoutLeadingZeros);
        return;
      }

      setValue(e.currentTarget.value);
    },
    [setValue]
  );

  return [value, valueSetter];
}
