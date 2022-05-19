import cx from "classnames";
import { MdClose } from "react-icons/md";
import { AriaDialogProps } from "@react-types/dialog";
import { createContext, FC, ReactNode, useContext, useRef } from "react";
import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";

import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from "@react-stately/overlays";

import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayProvider,
  OverlayContainer,
  OverlayProps,
  ModalAriaProps,
} from "@react-aria/overlays";

import { Button } from "./Button";

const style = {
  overlay: `
    bg-black/30 fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-y-auto grid place-items-center
  `,
  content: `
    relative z-10 bg-gray-900 text-gray-300 rounded-xl min-w-[300px] focus-ring
  `,
  closeButton: `
    h-auto absolute top-2 right-2 focus-ring p-1 rounded border-transparent
  `,
};

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

  usePreventScroll();
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog(props, ref);
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
      <div className={style.overlay} {...underlayProps}>
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
      className={cx(className, style.content)}
    >
      <FocusScope contain autoFocus>
        <Button
          size="sm"
          ref={closeButtonRef}
          onPress={handleClose}
          className={style.closeButton}
        >
          <MdClose />
        </Button>
        {children}
      </FocusScope>
    </div>
  );
}

export function useDialogProps() {
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
