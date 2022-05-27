import * as RTooltip from "@radix-ui/react-tooltip";
import cx from "classnames";
import type { FC, ReactNode } from "react";

export type TooltipProps = RTooltip.TooltipProps & {
  content: ReactNode;
  side?: RTooltip.PopperContentProps["side"];
  align?: RTooltip.PopperContentProps["align"];
  className?: string;
  arrowClassName?: string;
  contentClassName?: string;
  sideOffset?: RTooltip.TooltipContentProps["sideOffset"];
  alignOffset?: RTooltip.TooltipContentProps["alignOffset"];
};

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  side = "top",
  align,
  className,
  arrowClassName,
  contentClassName,
  sideOffset,
  alignOffset,
  ...props
}) => (
  <RTooltip.Provider>
    <RTooltip.Root {...props}>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Content
        className={cx(className, "tooltip")}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <RTooltip.Arrow
          offset={10}
          width={11}
          height={5}
          className={cx(arrowClassName, "tooltip--arrow")}
        />
        <div className={cx(contentClassName, "tooltip--content")}>
          {content}
        </div>
      </RTooltip.Content>
    </RTooltip.Root>
  </RTooltip.Provider>
);
