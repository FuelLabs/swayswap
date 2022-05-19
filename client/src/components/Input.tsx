import { AriaTextFieldOptions, useTextField } from "@react-aria/textfield";
import { FC, forwardRef, useRef } from "react";
import cx from "classnames";
import mergeRefs from "react-merge-refs";

const style = {
  input: `appearance-none w-full rounded-md bg-gray-700 px-4 py-2 focus-ring text-gray-100`,
};

type InputProps = AriaTextFieldOptions<"input"> & {
  className?: string;
};

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement | null>(null);
    let { inputProps } = useTextField(props, innerRef);
    return (
      <input
        ref={mergeRefs([innerRef, ref])}
        className={cx(className, style.input)}
        {...inputProps}
      />
    );
  }
);
