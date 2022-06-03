import { useButton } from "@react-aria/button";
import type { AriaButtonProps } from "@react-types/button";
import cx from "classnames";
import type { ReactNode } from "react";
import { useRef } from "react";

export type LinkProps = AriaButtonProps<"a"> & {
  href?: string;
  children: ReactNode;
  isExternal?: boolean;
  className?: string;
};

export function Link({
  href,
  isExternal,
  className,
  children,
  ...props
}: LinkProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const { buttonProps, isPressed } = useButton(
    { ...props, elementType: "a" },
    ref
  );

  return (
    <a
      {...buttonProps}
      {...(href && { href })}
      ref={ref}
      className={cx(className, "link")}
      data-pressed={isPressed}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}
