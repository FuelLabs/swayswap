import { useAtom, useAtomValue } from "jotai";
import { startTransition, useEffect } from "react";

import {
  swapActiveInputAtom,
  swapAmountAtom,
  swapCoinsAtom,
  swapHasSwappedAtom,
  useSetIsTyping,
} from "./jotai";
import type { SwapState } from "./types";
import { ActiveInput } from "./types";

import { CoinInput, useCoinInput } from "~/components/CoinInput";
import { CoinSelector } from "~/components/CoinSelector";
import { InvertButton } from "~/components/InvertButton";
import { NETWORK_FEE } from "~/config";
import { useUserInfo } from "~/hooks/useUserInfo";
import { toBigInt } from "~/lib/math";
import type { Coin } from "~/types";

const style = {
  switchDirection: `flex items-center sm:justify-center -my-5`,
};

type SwapComponentProps = {
  previewAmount?: bigint | null;
  onChange?: (swapState: SwapState) => void;
  isLoading?: boolean;
};

export function SwapComponent({
  onChange,
  isLoading,
  previewAmount,
}: SwapComponentProps) {
  const [initialAmount, setInitialAmount] = useAtom(swapAmountAtom);
  const [activeInput, setActiveInput] = useAtom(swapActiveInputAtom);
  const [[coinFrom, coinTo], setCoins] = useAtom(swapCoinsAtom);
  const hasSwapped = useAtomValue(swapHasSwappedAtom);
  const setTyping = useSetIsTyping();
  const [userInfo] = useUserInfo();

  const handleInvertCoins = () => {
    setTyping(true);
    if (activeInput === ActiveInput.to) {
      const from = fromInput.amount;
      startTransition(() => {
        setActiveInput(ActiveInput.from);
        fromInput.setAmount(toInput.amount);
        toInput.setAmount(from);
      });
    } else {
      const to = toInput.amount;
      startTransition(() => {
        setActiveInput(ActiveInput.to);
        toInput.setAmount(fromInput.amount);
        fromInput.setAmount(to);
      });
    }
    setCoins([coinTo, coinFrom]);
  };

  const fromInput = useCoinInput({
    coin: coinFrom,
    disableWhenEth: true,
    gasFee: toBigInt(NETWORK_FEE),
    onChangeCoin: (coin: Coin) => {
      setCoins([coin, coinTo]);
    },
    onInput: () => {
      setTyping(true);
      setActiveInput(ActiveInput.from);
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
      setActiveInput(ActiveInput.to);
    },
  });

  useEffect(() => {
    if (activeInput === ActiveInput.to) {
      toInput.setAmount(initialAmount);
    } else {
      fromInput.setAmount(initialAmount);
    }
  }, []);

  useEffect(() => {
    const currentInput = activeInput === ActiveInput.from ? fromInput : toInput;
    const amount = currentInput.amount;

    // This is used to reset preview amount when set first input value for null
    if (activeInput === ActiveInput.from && amount === null) {
      toInput.setAmount(null);
    }
    if (activeInput === ActiveInput.to && amount === null) {
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
    if (activeInput === ActiveInput.from) {
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
          {...fromInput.getInputProps()}
          {...(activeInput === ActiveInput.to && { isLoading })}
          autoFocus={!userInfo.isNew && activeInput === ActiveInput.from}
          rightElement={<CoinSelector {...fromInput.getCoinSelectorProps()} />}
        />
      </div>
      <div className={style.switchDirection}>
        <InvertButton onClick={handleInvertCoins} />
      </div>
      <div className="mb-4">
        <CoinInput
          {...toInput.getInputProps()}
          {...(activeInput === ActiveInput.from && { isLoading })}
          autoFocus={!userInfo.isNew && activeInput === ActiveInput.to}
          rightElement={<CoinSelector {...toInput.getCoinSelectorProps()} />}
        />
      </div>
    </>
  );
}
