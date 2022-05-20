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
import { forwardRef, useRef } from "react";
import type { ReactNode } from "react";

import type { ButtonProps } from "./Button";

const style = {
  popover: `
    bg-gray-900 rounded-xl text-gray-200
  `,
  content: `
    relative z-10 bg-gray-800 text-gray-300 rounded-xl min-w-[300px] focus-ring
  `,
  closeButton: `
    h-auto absolute top-2 right-2 focus-ring p-1 rounded border-transparent
  `,
};

export type PopoverProps = React.HTMLAttributes<Element> & {
  children: ReactNode;
  state: OverlayTriggerState;
  className?: string;
};

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ state, className, ...props }, ref) => {
    const { children } = props;
    const innerRef = useRef<HTMLDivElement | null>(null);
    const { overlayProps } = useOverlay(
      { isDismissable: true, isOpen: state.isOpen, onClose: state.close },
      innerRef
    );

    const { modalProps } = useModal();
    const { dialogProps } = useDialog(props as any, innerRef);

    if (!state.isOpen) return null;
    return (
      <OverlayContainer>
        <FocusScope restoreFocus autoFocus>
          <div
            className={cx(className, style.popover)}
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
);

type UsePopoverProps = Pick<AriaPositionProps, "offset" | "placement">;

export function usePopover(opts: UsePopoverProps = {}) {
  const state = useOverlayTriggerState({});
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const { triggerProps: triggerBaseProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
    triggerRef
  );

  const { overlayProps: positionProps } = useOverlayPosition({
    placement: "top",
    offset: 5,
    ...opts,
    isOpen: state.isOpen,
    targetRef: triggerRef,
    overlayRef,
  });

  const rootProps = {
    state,
    ...overlayProps,
    ...positionProps,
    ref: overlayRef,
  };

  function getTriggerProps(props: ButtonProps = {}) {
    return mergeProps({
      ...props,
      ...triggerBaseProps,
      ref: triggerRef,
      onPress: () => state.toggle(),
    });
  }

  return {
    ...state,
    close: () => {
      state.close();
      triggerRef.current?.focus();
    },
    getTriggerProps,
    rootProps,
  };
}
