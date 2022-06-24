import cx from "classnames";

import type { Coin, Maybe } from "~/types";

const style = {
  icon: `inline-flex rounded-full border-2 border-transparent`,
  iconLast: `last:ml-[-10px] last:z-1 border-gray-800`,
};

type TokenIconProps = {
  coinFrom?: Maybe<Coin>;
  coinTo?: Maybe<Coin>;
  size?: number;
};

export function TokenIcon({ coinFrom, coinTo, size = 20 }: TokenIconProps) {
  if (!coinFrom) return null;
  // Force image dimensions for retro compatibility
  const dimensionStyle = {
    height: size,
    width: size,
  };
  return (
    <div className="flex items-center">
      <span className={style.icon}>
        <img
          src={coinFrom.img}
          alt={coinFrom.name}
          height={size}
          width={size}
          style={dimensionStyle}
        />
      </span>
      {coinTo && (
        <span className={cx(style.icon, style.iconLast)}>
          <img
            src={coinTo.img}
            alt={coinTo.name}
            height={size}
            width={size}
            style={dimensionStyle}
          />
        </span>
      )}
    </div>
  );
}
