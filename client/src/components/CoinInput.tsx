import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "fuels";
import { useCallback } from "react";
import { useEffect } from "react";
import { Fragment, useState } from "react";
import NumberFormat from "react-number-format";
import urlJoin from "url-join";

const { PUBLIC_URL } = process.env;
const COIN_IMG_OTHER = urlJoin(PUBLIC_URL, 'icons/other.svg');

const style = {
  transferPropContainer: `bg-[#20242A] rounded-2xl p-4 text-3xl border border-[#20242A] 
      flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  // coin selector
  currencySelector: `flex1`,
  currencySelectorMenuItems: `absolute min-w-[200] mt-2 bg-[#191B1F] divide-gray-100 
      rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`,
  currencySelectorItem: `w-full h-min flex justify-between items-center 
      rounded-md text-lg font-medium p-2 mt-[-0.2rem] focus:outline-none cursor-pointer`,
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

function CoinImage (props: { src: string, alt?: string }) {
  // Set the pre-load image that should be always available
  const [source, setSource] = useState<string>(COIN_IMG_OTHER);

  // When image src is update reset to the loader image
  useEffect(() => {
    if (props.src !== source) {
      setSource(COIN_IMG_OTHER);
    }
  }, [props.src, setSource, source]);

  return (
    <>
      <img
        className="hidden"
        alt={`loader img of ${props.alt}`}
        src={props.src}
        onLoad={() => {
          setSource(props.src);
        }}
      />
      <img
        className="rounded-full border-none overflow-hidden"
        src={source}
        alt={props.alt}
        height={24}
        width={24}
      />
    </>
  )
}

function CoinItem (props: { coin: Coin }) {
  return (
    <>
      {props.coin && props.coin.img && (
        <CoinImage
          src={urlJoin(PUBLIC_URL, props.coin.img)}
          alt={props.coin.name}
        />
      )}
      <div className={style.currencySelectorTicker}>
        {props.coin?.name}
      </div>
    </>
  )
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
              {selected && (
                <CoinItem
                  coin={selected}
                />
              )}
            </div>
          </Menu.Button>
        </div>
        {!!coins?.length && (
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
                {(coins || []).map((coin) => (
                  <Menu.Item key={coin.assetId}>
                    {({ active }) => (
                      <div
                        className={classNames(style.currencySelectorItem, {
                          "bg-[#2D2F36] text-white": active,
                          "text-white": !active,
                        })}
                        onClick={() => handleSelect(coin)}
                      >
                        <CoinItem
                          key={coin.assetId}
                          coin={coin}
                        />
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
  disabled,
  onChangeAmount,
  onChangeCoin,
  onInput,
}: {
  disabled?: boolean;
  amount?: BigNumber | null;
  coin?: Coin | null;
  coins?: Coin[];
  onChangeAmount?: (value: BigNumber | null) => void;
  onChangeCoin?: (value: Coin) => void;
  onInput?: (...args: any) => void;
}) {
  return (
    <div className={style.transferPropContainer}>
      <div className="flex-1">
        <NumberFormat
          placeholder="0.0"
          value={amount && formatUnits(amount, 9)}
          displayType={disabled ? "text" : "input"}
          onValueChange={(e) => onChangeAmount?.(parseUnits(e.value, 9))}
          className={style.transferPropInput}
          thousandSeparator={false}
          onInput={onInput}
        />
      </div>
      <CoinSelector coins={coins} value={coin} onChange={onChangeCoin} />
    </div>
  );
}
