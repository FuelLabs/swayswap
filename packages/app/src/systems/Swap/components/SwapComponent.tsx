import { useAtom, useAtomValue } from "jotai";
import { startTransition, useEffect } from "react";

import {
  swapAmountAtom,
  swapActiveInputAtom,
  swapCoinsAtom,
  swapHasSwappedAtom,
  useSetIsTyping,
} from "../state";
import type { SwapState } from "../types";
import { SwapDirection } from "../types";

import { CoinInput, useCoinInput, CoinSelector } from "~/systems/Core";
import { InvertButton } from "~/systems/UI";
import type { Coin, Maybe } from "~/types";

const style = {
  switchDirection: `flex items-center sm:justify-center -my-5`,
};

type SwapComponentProps = {
  previewAmount?: Maybe<bigint>;
  networkFee?: Maybe<bigint>;
  onChange?: (swapState: SwapState) => void;
  isLoading?: boolean;
};

export function SwapComponent({
  onChange,
  isLoading,
  previewAmount,
  networkFee,
}: SwapComponentProps) {
  const [initialAmount, setInitialAmount] = useAtom(swapAmountAtom);
  const [activeInput, setActiveInput] = useAtom(swapActiveInputAtom);
  const [[coinFrom, coinTo], setCoins] = useAtom(swapCoinsAtom);
  const hasSwapped = useAtomValue(swapHasSwappedAtom);
  const setTyping = useSetIsTyping();

  const handleInvertCoins = () => {
    setTyping(true);
    if (activeInput === SwapDirection.toFrom) {
      const from = fromInput.amount;
      startTransition(() => {
        setActiveInput(SwapDirection.fromTo);
        fromInput.setAmount(toInput.amount);
        toInput.setAmount(from);
      });
    } else {
      const to = toInput.amount;
      startTransition(() => {
        setActiveInput(SwapDirection.toFrom);
        toInput.setAmount(fromInput.amount);
        fromInput.setAmount(to);
      });
    }
    setCoins([coinTo, coinFrom]);
  };

  const fromInput = useCoinInput({
    coin: coinFrom,
    disableWhenEth: true,
    gasFee: networkFee,
    onChangeCoin: (coin: Coin) => {
      setCoins([coin, coinTo]);
    },
    onInput: () => {
      setTyping(true);
      setActiveInput(SwapDirection.fromTo);
    },
  });

  const toInput = useCoinInput({
    coin: coinTo,
    disableWhenEth: true,
    onChangeCoin: (coin: Coin) => {
      setCoins([coinFrom, coin]);
    },
    onInput: () => {
      setTyping(true);
      setActiveInput(SwapDirection.toFrom);
    },
  });

  useEffect(() => {
    if (activeInput === SwapDirection.toFrom) {
      toInput.setAmount(initialAmount);
    } else {
      fromInput.setAmount(initialAmount);
    }
  }, []);

  useEffect(() => {
    const currentInput =
      activeInput === SwapDirection.fromTo ? fromInput : toInput;
    const amount = currentInput.amount;

    // This is used to reset preview amount when set first input value for null
    if (activeInput === SwapDirection.fromTo && amount === null) {
      toInput.setAmount(null);
    }
    if (activeInput === SwapDirection.toFrom && amount === null) {
      fromInput.setAmount(null);
    }

    // Set value to hydrate
    setInitialAmount(amount);

    if (coinFrom && coinTo) {
      // Call on onChange
      onChange?.({
        amount,
        amountFrom: fromInput.amount,
        coinFrom,
        coinTo,
        direction: activeInput,
        hasBalance: fromInput.hasEnoughBalance,
      });
    }
  }, [fromInput.amount, toInput.amount, coinFrom, coinTo]);

  useEffect(() => {
    if (activeInput === SwapDirection.fromTo) {
      toInput.setAmount(previewAmount || null);
    } else {
      fromInput.setAmount(previewAmount || null);
    }
  }, [previewAmount]);

  useEffect(() => {
    if (hasSwapped) {
      toInput.setAmount(null);
      fromInput.setAmount(null);
    }
  }, [hasSwapped]);

  return (
    <>
      <div className="mt-4">
        <CoinInput
          aria-label="Coin From Input"
          {...fromInput.getInputProps()}
          {...(activeInput === SwapDirection.toFrom && { isLoading })}
          autoFocus={activeInput === SwapDirection.fromTo}
          rightElement={<CoinSelector {...fromInput.getCoinSelectorProps()} />}
        />
      </div>
      <div className={style.switchDirection}>
        <InvertButton onClick={handleInvertCoins} />
      </div>
      <div className="mb-4">
        <CoinInput
          aria-label="Coin To Input"
          {...toInput.getInputProps()}
          {...(activeInput === SwapDirection.fromTo && { isLoading })}
          autoFocus={activeInput === SwapDirection.toFrom}
          rightElement={<CoinSelector {...toInput.getCoinSelectorProps()} />}
        />
      </div>
    </>
  );
}
