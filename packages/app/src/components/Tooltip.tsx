import { Transition } from "@headlessui/react";
import {
  useTooltip as useAriaTooltip,
  useTooltipTrigger,
} from "@react-aria/tooltip";
import { mergeProps, mergeRefs } from "@react-aria/utils";
import { useTooltipTriggerState } from "@react-stately/tooltip";
import cx from "classnames";
import { Children, cloneElement, forwardRef, Fragment, useRef } from "react";
import type { ReactNode } from "react";

const style = {
  tooltip: `
    py-1 px-3 absolute bg-gray-900 rounded-lg text-gray-200 top-[-5px] left-[50%] -translate-x-1/2 -translate-y-full
    text-xs text-center leading-relaxed whitespace-nowrap
  `,
};

export type TooltipProps = React.HTMLAttributes<Element> & {
  className?: string;
  content?: ReactNode;
  children: any;
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, children, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const state = useTooltipTriggerState({ delay: 100 });
    const { triggerProps, tooltipProps } = useTooltipTrigger(
      { delay: 100 },
      state,
      innerRef
    );

    const ariaTooltip = useAriaTooltip(tooltipProps, state);
    const customChildren = Children.only(children);

    return (
      <span className="relative">
        {cloneElement(
          customChildren,
          mergeProps(customChildren.props, triggerProps)
        )}
        <Transition
          as={Fragment}
          show={state.isOpen}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 -translate-y-1/2"
          enterTo="opacity-100 -translate-y-full"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 -translate-y-full"
          leaveTo="opacity-0 -translate-y-1/2"
        >
          <div
            ref={mergeRefs(ref, innerRef)}
            {...mergeProps(props, ariaTooltip.tooltipProps)}
            className={cx(className, style.tooltip)}
          >
            {content}
          </div>
        </Transition>
      </span>
    );
  }
);
