import cx from "classnames";
import type { NumberFormatProps } from "react-number-format";
import NumberFormat from "react-number-format";

const style = {
  transferPropContainer: `bg-gray-700 rounded-xl px-4 py-2 border border-gray-700 flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-gray-300 outline-none w-full`,
};

export type NumberInputProps = Omit<NumberFormatProps, "onChange"> & {
  disabled?: boolean;
  value?: number | string | null;
  onChange?: (value: string) => void;
  className?: string;
};

export function NumberInput({
  onChange,
  disabled,
  className,
  placeholder = "0.0",
  thousandSeparator = false,
  ...props
}: NumberInputProps) {
  return (
    <div className={cx(className, style.transferPropContainer)}>
      <NumberFormat
        {...props}
        placeholder={placeholder}
        thousandSeparator={thousandSeparator}
        displayType={disabled ? "text" : "input"}
        onValueChange={(e) => onChange?.(e.value)}
        className={style.transferPropInput}
      />
    </div>
  );
}
