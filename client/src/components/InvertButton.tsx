import { useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import cx from "classnames";
import { Button } from "./Button";

const style = {
  confirmButton: `
    p-0 relative w-12 h-12
    border-2 border-gray-700 bg-gray-800 rounded-2xl cursor-pointer
    text-gray-400 hover:text-gray-50
  `,
  icon: `transition-all`,
  iconLeft: `translate-x-[6px]`,
  iconRight: `translate-x-[-6px]`,
  rotate: `rotate-180`,
};

export function InvertButton({ onClick }: { onClick: () => void }) {
  const [isInverted, setInverted] = useState(false);

  function handleClick() {
    setInverted((s) => !s);
    onClick?.();
  }

  return (
    <Button
      onPress={handleClick}
      className={style.confirmButton}
      aria-label="Invert coins"
    >
      <BsArrowDown
        size={24}
        className={cx(style.icon, style.iconLeft, {
          [style.rotate]: isInverted,
        })}
      />
      <BsArrowUp
        size={24}
        className={cx(style.icon, style.iconRight, {
          [style.rotate]: isInverted,
        })}
      />
    </Button>
  );
}
