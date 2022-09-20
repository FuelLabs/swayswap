import cx from "classnames";
import { forwardRef } from "react";
import NumberFormat from "react-number-format";

import type { CoinInputProps } from "../hooks/useCoinInput";
import { useCoinInputDisplayValue } from "../hooks/useCoinInputDisplayValue";

import { DECIMAL_UNITS } from "~/config";
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
    const [displayedCoinValue, setDisplayedCoinValue] =
      useCoinInputDisplayValue(initialValue, onChange);

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
              autoComplete="off"
              className={cx(className, "coinInput--input")}
              autoFocus={autoFocus}
              inputMode={"decimal"}
              getInputRef={ref}
              allowNegative={false}
              value={displayedCoinValue}
              displayType={displayType}
              isAllowed={isAllowed}
              onInput={onInput}
              decimalScale={DECIMAL_UNITS}
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
