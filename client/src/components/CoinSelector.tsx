import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import urlJoin from "url-join";

import { Button } from "./Button";

const { PUBLIC_URL } = process.env;

const style = {
  currencySelector: `flex1`,
};

export interface Coin {
  assetId: string;
  name?: string;
  img?: string;
}

type CoinSelectorProps = {
  value?: Coin | null;
  onChange?: (coin: Coin) => void;
  coins?: Array<Coin>;
  isReadOnly?: boolean;
};

export function CoinSelector({
  value,
  coins,
  onChange,
  isReadOnly,
}: CoinSelectorProps) {
  const [selected, setSelected] = useState<Coin | null>(null);
  // const hasCoins = coins && coins.length > 1;

  useEffect(() => {
    if (!value) return setSelected(null);
    setSelected(value);
  }, [value]);

  // const handleSelect = useCallback(
  //   (coin: Coin) => {
  //     setSelected(coin);
  //     onChange?.(coin);
  //   },
  //   [setSelected, onChange]
  // );

  return (
    <div className={style.currencySelector}>
      <Button size="md" className="coin-selector" isDisabled={isReadOnly}>
        {selected && selected.img && (
          <img
            className="rounded-full border-none ml-1"
            src={`/${urlJoin(PUBLIC_URL, selected.img)}`}
            alt={selected.name}
            height={20}
            width={20}
          />
        )}
        <div className="ml-2">{selected?.name}</div>
        <FiChevronDown className="text-gray-500" />
      </Button>
    </div>
  );
}
