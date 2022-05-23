import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

import { PricePerToken } from "./PricePerToken";
import {
  swapActiveInputAtom,
  swapAmountAtom,
  swapCoinsAtom,
  swapIsTypingAtom,
} from "./jotai";
import type { SwapState } from "./types";
import { ActiveInput } from "./types";

import { CoinInput, useCoinInput } from "~/components/CoinInput";
import { InvertButton } from "~/components/InvertButton";
import { CoinETH } from "~/lib/constants";
import type { Coin } from "~/types";

const style = {
  switchDirection: `flex items-center justify-center -my-5`,
};

type SwapComponentProps = {
  previewAmount?: bigint | null;
  onChange?: (swapState: SwapState) => void;
  isLoading?: boolean;
};

export function SwapComponent({
  onChange,
  isLoading,
  previewAmount: previewValue,
}: SwapComponentProps) {
  const [initialAmount, setInitialAmount] = useAtom(swapAmountAtom);
  const [initialActiveInput, setInitialActiveInput] =
    useAtom(swapActiveInputAtom);

  const [[coinFrom, coinTo], setCoins] = useAtom(swapCoinsAtom);
  const setTyping = useSetAtom(swapIsTypingAtom);
  const activeInput = useRef<ActiveInput>(initialActiveInput);

  const handleInvertCoins = () => {
    if (activeInput.current === ActiveInput.to) {
      const from = fromInput.amount;
      fromInput.setAmount(toInput.amount);
      toInput.setAmount(from);
    } else {
      const to = toInput.amount;
      toInput.setAmount(fromInput.amount);
      fromInput.setAmount(to);
    }
    setCoins([coinTo, coinFrom]);
  };

  const fromInput = useCoinInput({
    coin: coinFrom,
    onChangeCoin: (coin: Coin) => {
      setCoins([coin, coinTo]);
    },
    onInput: () => {
      setTyping(true);
      activeInput.current = ActiveInput.from;
    },
  });

  const toInput = useCoinInput({
    coin: coinTo,
    onChangeCoin: (coin: Coin) => {
      setCoins([coinFrom, coin]);
    },
    onInput: () => {
      setTyping(true);
      activeInput.current = ActiveInput.to;
    },
  });

  useEffect(() => {
    if (activeInput.current === ActiveInput.to) {
      toInput.setAmount(initialAmount);
    } else {
      fromInput.setAmount(initialAmount);
    }
  }, []);

  useEffect(() => {
    const currentInput =
      activeInput.current === ActiveInput.from ? fromInput : toInput;
    const amount = currentInput.amount;
    const coin = activeInput.current === ActiveInput.from ? coinFrom : coinTo;

    // This is used to reset preview amount when set first input value for null
    if (activeInput.current === ActiveInput.from && amount === null) {
      toInput.setAmount(null);
    }
    if (activeInput.current === ActiveInput.to && amount === null) {
      fromInput.setAmount(null);
    }

    // Set value to hydrate
    setInitialAmount(amount);
    // Set current input
    setInitialActiveInput(activeInput?.current);

    if (coin && coinFrom && coinTo) {
      // Call on onChange
      onChange?.({
        amount,
        coin,
        from: coinFrom?.assetId,
        to: coinTo?.assetId,
        direction: activeInput.current,
        hasBalance: fromInput.hasEnoughBalance,
      });
    }
  }, [fromInput.amount, toInput.amount, coinFrom, coinTo]);

  useEffect(() => {
    if (previewValue == null) return;
    if (activeInput.current === ActiveInput.from) {
      toInput.setAmount(previewValue);
    } else {
      fromInput.setAmount(previewValue);
    }
    setTyping(false);
  }, [previewValue]);

  return (
    <>
      <div className="mt-4">
        <CoinInput
          {...fromInput.getInputProps()}
          {...(activeInput.current === ActiveInput.to && { isLoading })}
          autoFocus={activeInput.current === ActiveInput.from}
          coinSelectorDisabled={coinFrom?.assetId === CoinETH}
        />
      </div>
      <div className={style.switchDirection}>
        <InvertButton onClick={handleInvertCoins} />
      </div>
      <div className="mb-4">
        <CoinInput
          {...toInput.getInputProps()}
          {...(activeInput.current === ActiveInput.from && { isLoading })}
          autoFocus={activeInput.current === ActiveInput.to}
          coinSelectorDisabled={coinTo?.assetId === CoinETH}
        />
      </div>
      <PricePerToken
        fromCoin={coinFrom?.symbol}
        fromAmount={fromInput.amount}
        toCoin={coinTo?.symbol}
        toAmount={toInput.amount}
      />
    </>
  );
}
