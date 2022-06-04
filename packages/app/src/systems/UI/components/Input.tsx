import type { AriaTextFieldOptions } from "@react-aria/textfield";
import { useTextField } from "@react-aria/textfield";
import { mergeRefs } from "@react-aria/utils";
import cx from "classnames";
import type { FC } from "react";
import { forwardRef, useRef } from "react";

type InputProps = AriaTextFieldOptions<"input"> & {
  className?: string;
};

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement | null>(null);
    const { inputProps } = useTextField(props, innerRef);
    return (
      <input
        ref={mergeRefs(innerRef, ref)}
        className={cx(className, "input", {
          "input--readOnly": props.isReadOnly,
        })}
        {...inputProps}
      />
    );
  }
);
