import { useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import cx from "classnames";

const style = {
  confirmButton: `relative flex items-center rounded-2xl font-semibold w-12 h-12
    border border-[#20242A] bg-[#191B1F] border-4 rounded-2xl cursor-pointer
    text-gray-500 hover:text-gray-50`,
  icon: `transition-all`,
  iconLeft: `translate-x-[4px]`,
  iconRight: `translate-x-[-4px]`,
  rotate: `rotate-180`,
};

export function InvertButton({ onClick }: { onClick: () => void }) {
  const [isInverted, setInverted] = useState(false);

  function handleClick() {
    setInverted((s) => !s);
    onClick?.();
  }

  return (
    <div onClick={handleClick} className={style.confirmButton}>
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
    </div>
  );
}
