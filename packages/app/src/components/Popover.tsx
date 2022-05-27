import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import type { AriaPositionProps } from "@react-aria/overlays";
import {
  useOverlayTrigger,
  useOverlayPosition,
  DismissButton,
  useOverlay,
  useModal,
  OverlayContainer,
} from "@react-aria/overlays";
import { mergeProps, mergeRefs } from "@react-aria/utils";
import type { OverlayTriggerState } from "@react-stately/overlays";
import { useOverlayTriggerState } from "@react-stately/overlays";
import cx from "classnames";
import type {
  ReactNode,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from "react";
import { forwardRef, useRef } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

export type PopoverProps = React.HTMLAttributes<Element> & {
  children: ReactNode;
  state: OverlayTriggerState;
  className?: string;
  bg?: string;
};

type PopoverComponent = ForwardRefExoticComponent<
  PropsWithoutRef<PopoverProps> & RefAttributes<HTMLDivElement>
>;

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ state, className, ...props }, ref) => {
    const { children } = props;
    const innerRef = useRef<HTMLDivElement | null>(null);
    const isOpen = state.isOpen;
    const { overlayProps } = useOverlay(
      { isOpen, isDismissable: true, onClose: state.close },
      innerRef
    );

    const { modalProps } = useModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { dialogProps } = useDialog(props as any, innerRef);

    if (!isOpen) return null;
    return (
      <OverlayContainer>
        <FocusScope restoreFocus autoFocus>
          <div
            className={cx("popover", className)}
            ref={mergeRefs(ref, innerRef)}
            {...mergeProps(overlayProps, dialogProps, props, modalProps)}
          >
            {children}
            <DismissButton onDismiss={state.close} />
          </div>
        </FocusScope>
      </OverlayContainer>
    );
  }
) as PopoverComponent & {
  Arrow: typeof PopoverArrow;
};

Popover.Arrow = PopoverArrow;

function PopoverArrow({ className }: { className?: string }) {
  return (
    <div className={cx(className, "popover--arrow")}>
      <MdOutlineArrowDropDown size={30} />
    </div>
  );
}

type UsePopoverProps = Pick<
  AriaPositionProps,
  "offset" | "placement" | "crossOffset"
> & {
  isOpen?: boolean;
};

export function usePopover({
  offset = 5,
  placement = "top",
  crossOffset,
  isOpen,
}: UsePopoverProps = {}) {
  const state = useOverlayTriggerState({ defaultOpen: isOpen });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const { triggerProps: triggerBaseProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
    triggerRef
  );

  const { overlayProps: positionProps } = useOverlayPosition({
    placement,
    offset,
    crossOffset,
    isOpen: state?.isOpen,
    targetRef: triggerRef,
    overlayRef,
  });

  const rootProps = mergeProps({ state }, overlayProps, positionProps, {
    ref: overlayRef,
  });

  const triggerProps = mergeProps(
    triggerBaseProps,
    { ref: triggerRef },
    { onClick: () => state.toggle() }
  );

  return {
    ...state,
    close: () => {
      state.close();
      triggerRef.current?.focus();
    },
    triggerProps,
    rootProps,
  };
}
