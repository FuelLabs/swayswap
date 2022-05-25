import cx from "classnames";

import type { Coin } from "~/types";

const style = {
  icon: `inline-flex rounded-full ml-1 border-2 border-transparent overflow-hidden`,
  iconLast: `last:translate-x-[-10px] last:z-10 border-gray-800`,
};

type TokenIconProps = {
  coinFrom?: Coin | null;
  coinTo?: Coin | null;
  size?: number;
};

export function TokenIcon({ coinFrom, coinTo, size = 20 }: TokenIconProps) {
  if (!coinFrom) return null;
  return (
    <div className="flex items-center">
      <span className={style.icon}>
        <img
          src={coinFrom.img}
          alt={coinFrom.name}
          height={size}
          width={size}
        />
      </span>
      {coinTo && (
        <span className={cx(style.icon, style.iconLast)}>
          <img src={coinTo.img} alt={coinTo.name} height={size} width={size} />
        </span>
      )}
    </div>
  );
}
