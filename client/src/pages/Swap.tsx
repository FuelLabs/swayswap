import { useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import {
  assets,
  // filterCoin,
  // getSwappableCoins,
} from "src/lib/SwaySwapMetadata";
import { Coin, CoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { BigNumber } from "fuels";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8 w-full
    disabled:bg-[#a0bbb1]`,
  switchDirection: `flex items-center justify-center -my-3`,
};

// Mock before implementing
const getRate = (from: Coin, to: Coin) => {
  if (to.assetId === assets[0].assetId) {
    return 0.25;
  }
  return 4;
};

export const Swap = () => {
  const handleSubmit = (e: any) => {
    console.log(e);
  };
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);
  const [fromAmount, setFromAmount] = useState(null as BigNumber | null);
  const [toAmount, setToAmount] = useState(null as BigNumber | null);

  const setAmountField = (amount: BigNumber | null, field: "from" | "to") => {
    if (field === "from") {
      setFromAmount(amount);
      setToAmount(amount?.mul(getRate(coinFrom, coinTo)) ?? null);
    } else {
      setToAmount(amount);
      setFromAmount(amount?.div(getRate(coinFrom, coinTo)) ?? null);
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Swap</h1>
          <div>
            <RiSettings3Fill />
          </div>
        </div>

        <div className="mt-6">
          {/* TODO: Enable exchange from n:n for now only ETH to OTHER */}
          <CoinInput
            coin={coinFrom}
            amount={fromAmount}
            onChangeAmount={(amount) => setAmountField(amount, "from")}
            coins={[]}
            // coins={filterCoin(getSwappableCoins(coinTo), coinFrom)}
            onChangeCoin={(coin: Coin) => setCoins([coin, coinTo])}
          />
        </div>
        <div className={style.switchDirection}>
          <InvertButton
            onClick={() => {
              const _toAmount = toAmount;
              setToAmount(fromAmount);
              setFromAmount(_toAmount);
              setCoins([coinTo, coinFrom]);
            }}
          />
        </div>
        <div className="mb-10">
          <CoinInput
            coin={coinTo}
            amount={toAmount}
            onChangeAmount={(amount) => setAmountField(amount, "to")}
            coins={[]}
            // coins={filterCoin(getSwappableCoins(coinFrom), coinTo)}
            onChangeCoin={(coin: Coin) => setCoins([coinFrom, coin])}
          />
        </div>
        <button
          className={style.confirmButton}
          onClick={(e) => handleSubmit(e)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
