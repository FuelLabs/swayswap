import { useAtom } from 'jotai';
import { useEffect, useRef } from "react";
import { CoinInput, useCoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { Coin } from "src/types";
import { swapActiveInputAtom, swapAmountAtom, swapCoinsAtom } from './jotai';
import { ActiveInput, SwapState } from './types';

const style = {
  switchDirection: `flex items-center justify-center -my-5`,
};

type SwapComponentProps = {
  previewAmount?: bigint | null;
  onChange?: (swapState: SwapState) => void;
};

export function SwapComponent({
  previewAmount: previewValue,
  onChange,
}: SwapComponentProps) {
  const [initialAmount, setInitialAmount] = useAtom(swapAmountAtom);
  const [initialActiveInput, setInitialActiveInput] = useAtom(swapActiveInputAtom);
  const [[coinFrom, coinTo], setCoins] = useAtom(swapCoinsAtom);
  const activeInput = useRef<ActiveInput>(initialActiveInput);

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
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    onInput: () => (activeInput.current = ActiveInput.from),
  });

  const toInput = useCoinInput({
    coin: coinTo,
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    onInput: () => (activeInput.current = ActiveInput.to),
  });

  useEffect(() => {
    if (activeInput.current === ActiveInput.to) {
      toInput.setAmount(initialAmount);
    } else {
      fromInput.setAmount(initialAmount);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const amount = activeInput.current === ActiveInput.from
      ? fromInput.amount
      : toInput.amount;

    // Set value to hydrate
    setInitialAmount(amount);
    // Set current input
    setInitialActiveInput(activeInput?.current);

    // Call on onChange
    onChange?.({
      from: coinFrom.assetId,
      to: coinTo.assetId,
      amount,
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
