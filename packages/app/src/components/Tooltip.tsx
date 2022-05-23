import * as RTooltip from "@radix-ui/react-tooltip";
import cx from "classnames";
import type { FC, ReactNode } from "react";

const styles = {
  arrow: `fill-gray-900`,
  content: `rounded-md text-sm py-1 px-3 bg-gray-900 text-gray-400`,
};

export type TooltipProps = RTooltip.TooltipProps & {
  content: ReactNode;
  side?: RTooltip.PopperContentProps["side"];
  align?: RTooltip.PopperContentProps["align"];
  arrowClassName?: string;
  className?: string;
};

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  side = "top",
  align,
  className,
  arrowClassName,
  ...props
}) => (
  <RTooltip.Provider>
    <RTooltip.Root {...props}>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Content
        className={cx(className, styles.content)}
        side={side}
        align={align}
      >
        <RTooltip.Arrow
          offset={10}
          width={11}
          height={5}
          className={cx(arrowClassName, styles.arrow)}
        />
        {content}
      </RTooltip.Content>
    </RTooltip.Root>
  </RTooltip.Provider>
);
