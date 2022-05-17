import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { useState, useEffect, useCallback, Fragment } from "react";
import urlJoin from "url-join";

const { PUBLIC_URL } = process.env;

const style = {
  currencySelector: `flex1`,
  currencySelectorMenuItems: `absolute w-full mt-2 bg-[#191B1F] divide-gray-100
      rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`,
  currencySelectorItem: `flex justify-around rounded-md w-full px-2 py-2 text-sm cursor-pointer`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36]
      rounded-2xl text-xl font-medium p-2 mt-[-0.2rem] focus:outline-none`,
  currencySelectorTicker: `mx-2`,
  menuWrapper: `px-1 py-1`,
};

export interface Coin {
  assetId: string;
  name?: string;
  img?: string;
}

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
              {selected && selected.img && (
                <img
                  className="rounded-full border-none"
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
                        {coin && coin.img && (
                          <div className="flex flex-wrap justify-center">
                            <div className="w-6/12 px-4 sm:w-4/12">
                              <img
                                className="h-auto max-w-full rounded border-none align-middle shadow-lg"
                                src={urlJoin(PUBLIC_URL, coin.img)}
                                alt="eth"
                                height={24}
                                width={24}
                              />
                            </div>
                          </div>
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
