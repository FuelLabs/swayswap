import cx from "classnames";
import { forwardRef, useEffect, useState } from "react";
import NumberFormat from "react-number-format";

import type { CoinInputProps } from "../hooks/useCoinInput";

import { DECIMAL_UNITS } from "~/config";
import { Spinner } from "~/systems/UI";

function getRightValue(value: string) {
  if (process.env.NODE_ENV === "test" && !value) return null;
  if (value === "0.0") return "0";
  if (value === ".") return "0.";
  return value;
}

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
              className={cx(className, "coinInput--input")}
              autoFocus={autoFocus}
              inputMode={"decimal"}
              getInputRef={ref}
              allowNegative={false}
              defaultValue={initialValue}
              value={getRightValue(value || "")}
              displayType={displayType}
              isAllowed={isAllowed}
              onInput={onInput}
              decimalScale={displayType === "text" ? 4 : DECIMAL_UNITS}
              placeholder={props.placeholder || "0"}
              allowedDecimalSeparators={[".", ","]}
              thousandSeparator={false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange?.(e.target.value);
                setValue(e.target.value);
              }}
            />
          )}
          {rightElement}
        </div>
        {bottomElement}
      </div>
    );
  }
);
