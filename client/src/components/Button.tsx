import { useButton } from "@react-aria/button";
import { AriaButtonProps } from "@react-types/button";
import { forwardRef, useRef } from "react";
import cx from "classnames";
import mergeRefs from "react-merge-refs";

export type ButtonProps = AriaButtonProps<"button"> & {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "base" | "primary" | "ghost";
  isFull?: boolean;
  isDisabled?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { size = "sm", variant = "base", className, isFull, isDisabled, ...props },
    ref
  ) => {
    const innerRef = useRef<HTMLButtonElement | null>(null);
    const { buttonProps, isPressed } = useButton(
      { ...props, isDisabled },
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
        ref={mergeRefs([innerRef, ref])}
        {...buttonProps}
        className={classes}
        aria-pressed={!isDisabled && isPressed}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        {props.children}
      </button>
    );
  }
);
