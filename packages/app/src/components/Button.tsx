import { useButton } from "@react-aria/button";
import { mergeProps, mergeRefs } from "@react-aria/utils";
import type { AriaButtonProps } from "@react-types/button";
import cx from "classnames";
import { forwardRef, useRef } from "react";

import { Spinner } from "./Spinner";

import { omit } from "~/lib/utils";

export type ButtonProps = AriaButtonProps<"button"> & {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "base" | "primary" | "ghost";
  isFull?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
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

    const customProps = omit(["onPress"], props);

    return (
      <button
        ref={mergeRefs(innerRef, ref)}
        {...mergeProps(customProps, buttonProps)}
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
