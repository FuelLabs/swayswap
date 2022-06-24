import cx from "classnames";
import { useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

import { Button } from "./Button";

const style = {
  confirmButton: `
    p-0 relative w-10 h-10 rounded-xl mb-3 mt-0 translate-x-[60px]
    border-2 border-gray-700 bg-gray-800 cursor-pointer text-gray-400
    sm:translate-x-0 sm:my-1 sm:w-12 sm:h-12 sm:rounded-xl hover:text-gray-50`,
  icon: `transition-all w-[14px] sm:w-[18px]`,
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
