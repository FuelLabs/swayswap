import { useDialog as useReactAriaDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import type { OverlayProps, ModalAriaProps } from "@react-aria/overlays";
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayProvider,
  OverlayContainer,
} from "@react-aria/overlays";
import type { OverlayTriggerState } from "@react-stately/overlays";
import { useOverlayTriggerState } from "@react-stately/overlays";
import type { AriaDialogProps } from "@react-types/dialog";
import cx from "classnames";
import { createContext, useContext, useRef } from "react";
import type { FC, ReactNode } from "react";
import { MdClose } from "react-icons/md";

import { Button } from "./Button";

type DialogContext = {
  state?: OverlayTriggerState;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
  overlayProps?: React.HTMLAttributes<HTMLElement>;
  modalProps?: ModalAriaProps;
  dialogProps?: React.HTMLAttributes<HTMLElement>;
  titleProps?: React.HTMLAttributes<HTMLElement>;
};

const ctx = createContext<DialogContext>({});

export type DialogProps = OverlayProps &
  AriaDialogProps & {
    children: ReactNode;
    state: OverlayTriggerState;
  };

type DialogComponent = FC<DialogProps> & {
  Provider: typeof OverlayProvider;
  Title: typeof DialogTitle;
  Content: typeof DialogContent;
};

export const Dialog: DialogComponent = ({ state, ...props }) => {
  const { children } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const { overlayProps, underlayProps } = useOverlay(
    {
      ...props,
      isDismissable: true,
      isOpen: state.isOpen,
      onClose: state.close,
    },
    ref
  );

  usePreventScroll({ isDisabled: !state.isOpen });
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useReactAriaDialog(props, ref);
  const ctxValue = {
    ref,
    state,
    overlayProps,
    modalProps,
    dialogProps,
    titleProps,
  };

  if (!state.isOpen) return null;
  return (
    <OverlayContainer>
      <div className="dialog--overlay" {...underlayProps}>
        <ctx.Provider value={ctxValue}>{children}</ctx.Provider>
      </div>
    </OverlayContainer>
  );
};

Dialog.Provider = OverlayProvider;
Dialog.Title = DialogTitle;
Dialog.Content = DialogContent;

type DialogTitleProps = {
  children?: ReactNode;
  className?: string;
};

function DialogTitle({ children, className }: DialogTitleProps) {
  const { titleProps } = useContext(ctx);
  return (
    <h2 {...titleProps} className={className}>
      {children}
    </h2>
  );
}

type DialogContentProps = {
  children: ReactNode;
  className?: string;
};

function DialogContent({ children, className }: DialogContentProps) {
  const props = useContext(ctx);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  function handleClose() {
    props.state?.close();
  }

  return (
    <div
      {...props.overlayProps}
      {...props.dialogProps}
      {...props.modalProps}
      ref={props.ref}
      className={cx(className, "dialog")}
    >
      <FocusScope contain autoFocus>
        <Button
          size="sm"
          ref={closeButtonRef}
          onPress={handleClose}
          className="dialog--closeBtn"
        >
          <MdClose />
        </Button>
        {children}
      </FocusScope>
    </div>
  );
}

export function useDialog() {
  const state = useOverlayTriggerState({});
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const openButtonProps = {
    ref: openButtonRef,
    onPress: () => state.open(),
  };

  const closeButtonProps = {
    ref: closeButtonRef,
    onPress: () => state.close(),
  };

  const dialogProps = {
    state,
  };

  return {
    ...state,
    state,
    openButtonProps,
    closeButtonProps,
    dialogProps,
  };
}
