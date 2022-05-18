import { useButton } from "@react-aria/button";
import { AriaButtonProps } from "@react-types/button";
import { useRef } from "react";
import cx from "classnames";

export type ButtonProps = AriaButtonProps<"button"> & {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "base" | "primary" | "ghost";
};

export function Button({
  size = "sm",
  variant = "base",
  className,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { buttonProps, isPressed } = useButton(props, ref);

  const classes = cx({
    ...(className && { [className]: true }),
    button: true,
    "button--sm": size === "sm",
    "button--md": size === "md",
    "button--lg": size === "lg",
    "button--base": variant === "base",
    "button--primary": variant === "primary",
    "button--ghost": variant === "ghost",
  });

  return (
    <button
      ref={ref}
      {...buttonProps}
      className={classes}
      aria-pressed={isPressed}
    >
      {props.children}
    </button>
  );
}
