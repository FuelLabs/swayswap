import { forwardRef, useEffect, useState } from "react";
import NumberFormat from "react-number-format";

import type { CoinInputProps } from "../hooks/useCoinInput";

import { DECIMAL_UNITS } from "~/config";
import { Spinner } from "~/systems/UI";

function getRightValue(value: string, displayType: string) {
  if (displayType === "text") return value;
  if (value === "0.0") return "0";
  return value === "." ? "0." : value;
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
              className="coinInput--input"
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
              placeholder={props.placeholder || "0"}
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
