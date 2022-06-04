import { FocusScope, useFocusManager } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { ReactNode, KeyboardEvent } from "react";
import { Children, cloneElement } from "react";

function ButtonGroupChildren({ children }: ButtonGroupProps) {
  const focusManager = useFocusManager();
  const onKeyDown = (e: KeyboardEvent) => {
    // eslint-disable-next-line default-case
    switch (e.key) {
      case "ArrowRight":
        focusManager.focusNext({ wrap: true });
        break;
      case "ArrowLeft":
        focusManager.focusPrevious({ wrap: true });
        break;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customChildren = Children.toArray(children).map((child: any) =>
    cloneElement(child, mergeProps(child.props, { onKeyDown }))
  );

  return <>{customChildren}</>;
}

type ButtonGroupProps = {
  children: ReactNode;
};

export function ButtonGroup({ children }: ButtonGroupProps) {
  return (
    <FocusScope>
      <ButtonGroupChildren>{children}</ButtonGroupChildren>
    </FocusScope>
  );
}
