import { FocusScope, useFocusManager } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { ReactNode } from "react";
import { Children, cloneElement } from "react";

function ButtonGroupChildren({ children }: ButtonGroupProps) {
  const focusManager = useFocusManager();
  const onKeyDown = (e: any) => {
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
