import { useButton } from "@react-aria/button";
import { mergeRefs } from "@react-aria/utils";
import type { AriaButtonProps } from "@react-types/button";
import cx from "classnames";
import { forwardRef, useRef } from "react";

import { Spinner } from "./Spinner";

export type ButtonProps = AriaButtonProps<"button"> & {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "base" | "primary" | "ghost";
  isFull?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  /**
   * TODO: use useDialog from react-aria instead
   * @deprecated this is used here just because of Radix Dialog.Trigger use
   * a prop called asChild as pass onClick as context
   * */
  onClick?: () => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = "sm",
      variant = "base",
      className,
      isFull,
      isDisabled,
      isLoading,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLButtonElement | null>(null);
    const { buttonProps, isPressed } = useButton(
      {
        ...props,
        onPress: props.onClick ? props.onClick : props.onPress,
        isDisabled,
      },
      innerRef
    );

    const classes = cx({
      ...(className && { [className]: true }),
      button: true,
      "w-full justify-center": isFull,
      "button--sm": size === "sm",
      "button--md": size === "md",
      "button--lg": size === "lg",
      "button--base": variant === "base",
      "button--primary": variant === "primary",
      "button--ghost": variant === "ghost",
    });

    return (
      <button
        ref={mergeRefs(innerRef, ref)}
        {...buttonProps}
        className={classes}
        aria-pressed={!isDisabled && isPressed}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        {isLoading ? (
          <Spinner size={size === "sm" ? 16 : 22} variant="base" />
        ) : (
          props.children
        )}
      </button>
    );
  }
);
