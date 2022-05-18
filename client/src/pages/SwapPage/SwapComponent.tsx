import { useEffect, useRef, useState } from "react";
import assets from "src/lib/CoinsMetadata";
import { Coin, CoinInput, useCoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { ActiveInput, SwapState } from "./types";

const style = {
  switchDirection: `flex items-center justify-center -my-3`,
};

const getOtherCoins = (coins: Coin[]) =>
  assets.filter(({ assetId }) => !coins.find((c) => c.assetId === assetId));

type SwapComponentProps = {
  previewAmount?: bigint | null;
  onChange?: (swapState: SwapState) => void;
};

export function SwapComponent({
  previewAmount: previewValue,
  onChange,
}: SwapComponentProps) {
  const activeInput = useRef<ActiveInput>(ActiveInput.from);
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);

  const handleInvertCoins = () => {
    if (activeInput.current === ActiveInput.to) {
      activeInput.current = ActiveInput.from;
      fromInput.setAmount(toInput.amount);
      toInput.setAmount(null);
    } else {
      activeInput.current = ActiveInput.to;
      toInput.setAmount(fromInput.amount);
      fromInput.setAmount(null);
    }
    setCoins([coinTo, coinFrom]);
  };

  const fromInput = useCoinInput({
    coin: coinFrom,
    coins: getOtherCoins([coinFrom, coinTo]),
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    onInput: () => (activeInput.current = ActiveInput.from),
  });

  const toInput = useCoinInput({
    coin: coinTo,
    coins: getOtherCoins([coinFrom, coinTo]),
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    onInput: () => (activeInput.current = ActiveInput.to),
  });

  useEffect(() => {
    onChange?.({
      from: coinFrom.assetId,
      to: coinTo.assetId,
      amount:
        activeInput.current === ActiveInput.from
          ? fromInput.amount
          : toInput.amount,
      direction: activeInput.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromInput.amount, toInput.amount, coinFrom, coinTo]);

  useEffect(() => {
    if (!previewValue) return;
    if (activeInput.current === ActiveInput.from) {
      toInput.setAmount(previewValue);
    } else {
      fromInput.setAmount(previewValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewValue]);

  return (
    <>
      <div className="mt-6">
        <CoinInput {...fromInput.getInputProps()} />
      </div>
      <div className={style.switchDirection}>
        <InvertButton onClick={handleInvertCoins} />
      </div>
      <div className="mb-10">
        <CoinInput {...toInput.getInputProps()} />
      </div>
    </>
  );
}
