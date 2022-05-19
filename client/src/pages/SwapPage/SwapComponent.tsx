import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from "react";
import { CoinInput, useCoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { Coin } from "src/types";
import { ActiveInput, swapActiveInputAtom, swapCoinsAtom, SwapState } from './jotai';

const style = {
  switchDirection: `flex items-center justify-center -my-5`,
};

type SwapComponentProps = {
  previewAmount?: bigint | null;
  onChange?: (swapState: SwapState) => void;
  amount?: bigint | null;
};

export function SwapComponent({
  previewAmount: previewValue,
  onChange,
  amount,
}: SwapComponentProps) {
  const [initialActiveInput, setInitialActiveInput] = useAtom(swapActiveInputAtom);
  const activeInput = useRef<ActiveInput>(initialActiveInput);

  useEffect(() => {
    setInitialActiveInput(activeInput?.current);
  }, [activeInput.current]);

  const [[coinFrom, coinTo], setCoins] = useAtom(swapCoinsAtom);

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
    amount: activeInput.current === ActiveInput.from ? amount : undefined,
    coin: coinFrom,
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    onInput: () => (activeInput.current = ActiveInput.from),
  });

  const toInput = useCoinInput({
    amount: activeInput.current === ActiveInput.to ? amount : undefined,
    coin: coinTo,
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
      <div className="mt-4">
        <CoinInput {...fromInput.getInputProps()} autoFocus />
      </div>
      <div className={style.switchDirection}>
        <InvertButton onClick={handleInvertCoins} />
      </div>
      <div className="mb-4">
        <CoinInput {...toInput.getInputProps()} />
      </div>
    </>
  );
}
