import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { useCallback } from "react";
import { useEffect } from "react";
import { Fragment, useState } from "react";
import NumberFormat from "react-number-format";
import urlJoin from "url-join";

const { PUBLIC_URL } = process.env;

const style = {
  transferPropContainer: `bg-[#20242A] rounded-2xl p-4 text-3xl border border-[#20242A] 
      flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  // coin selector
  currencySelector: `flex1`,
  currencySelectorMenuItems: `absolute w-full mt-2 bg-[#191B1F] divide-gray-100 
      rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`,
  currencySelectorItem: `flex justify-around rounded-md w-full px-2 py-2 text-sm cursor-pointer`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] 
      rounded-2xl text-xl font-medium p-2 mt-[-0.2rem] focus:outline-none`,
  currencySelectorTicker: `mx-2`,
  menuWrapper: `px-1 py-1`,
};

export type Coin = {
  name: string;
  assetId: string;
  amount: number;
  img: string;
};

export function CoinSelector({
  value,
  coins,
  onChange,
}: {
  value?: Coin | null;
  onChange?: (coin: Coin) => void;
  coins?: Array<Coin>;
}) {
  const [selected, setSelected] = useState<Coin | null>(null);
  const hasCoins = coins && coins.length > 1;

  useEffect(() => {
    if (!value) {
      return setSelected(null);
    }
    setSelected(value);
  }, [value]);

  const handleSelect = useCallback(
    (coin: Coin) => {
      setSelected(coin);
      onChange?.(coin);
    },
    [setSelected, onChange]
  );

  return (
    <div className={style.currencySelector}>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className={classNames({
              "cursor-default": !hasCoins,
            })}
          >
            <div
              className={classNames(style.currencySelectorContent, {
                "hover:bg-opacity-30": hasCoins,
              })}
            >
              {selected && (
                <img
                  src={urlJoin(PUBLIC_URL, selected.img)}
                  alt="eth"
                  height={24}
                  width={24}
                />
              )}
              <div className={style.currencySelectorTicker}>
                {selected?.name}
              </div>
            </div>
          </Menu.Button>
        </div>
        {hasCoins && (
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={style.currencySelectorMenuItems}>
              <div className={style.menuWrapper}>
                {coins.map((coin) => (
                  <Menu.Item key={coin.assetId}>
                    {({ active }) => (
                      <div
                        className={classNames(style.currencySelectorItem, {
                          "bg-[#2D2F36] text-white": active,
                          "text-white": !active,
                        })}
                        onClick={() => handleSelect(coin)}
                      >
                        {coin && (
                          <img
                            src={urlJoin(PUBLIC_URL, coin.img)}
                            alt="eth"
                            height={24}
                            width={24}
                          />
                        )}
                        <div className={style.currencySelectorTicker}>
                          {coin?.name}
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        )}
      </Menu>
    </div>
  );
}

export function CoinInput({
  amount,
  coin,
  coins,
  onChangeAmount,
  onChangeCoin,
}: {
  amount?: number | string | null;
  coin?: Coin | null;
  coins?: Coin[];
  onChangeAmount?: (value: string | null) => void;
  onChangeCoin?: (value: Coin) => void;
}) {
  return (
    <div className={style.transferPropContainer}>
      <div className="flex-1">
        <NumberFormat
          placeholder="0.0"
          value={amount}
          onValueChange={(e) => onChangeAmount?.(e.value)}
          className={style.transferPropInput}
          thousandSeparator={false}
        />
      </div>
      <CoinSelector coins={coins} value={coin} onChange={onChangeCoin} />
    </div>
  );
}
