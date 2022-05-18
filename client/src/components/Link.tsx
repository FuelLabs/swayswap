import { useButton } from "@react-aria/button";
import { ReactNode, useRef } from "react";
import { AriaButtonProps } from "@react-types/button";

export type LinkProps = AriaButtonProps<"a"> & {
  href?: string;
  children: ReactNode;
  isExternal?: boolean;
};

export function Link({ href, isExternal, children, ...props }: LinkProps) {
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
      className="link"
      data-pressed={isPressed}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}
