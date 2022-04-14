import { useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import assets from "src/lib/CoinsMetadata";
import { Coin, CoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
  switchDirection: `flex items-center justify-center -my-3`
};

// Mock before implementing
const getRate = (from: Coin, to: Coin) => {
  if (to.assetId === assets[0].assetId) {
    return 0.25
  }
  return 4
}

export const Swap = () => {
  const handleSubmit = (e: any) => {
    console.log(e);
  }
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([assets[0], assets[1]]);
  const getOtherCoins = (coins: Coin[]) => assets.filter(({ assetId }) => !coins.find(c => c.assetId === assetId));
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const setAmountField = (amount: string, field: 'from' | 'to') => {
    if (field === 'from') {
      setFromAmount(amount);
      setToAmount(String(Number(amount) * getRate(coinFrom, coinTo)));
    } else {
      setToAmount(amount);
      setFromAmount(String(Number(amount) / getRate(coinFrom, coinTo)));
    }
  }

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
          <CoinInput
            coin={coinFrom}
            amount={fromAmount}
            onChangeAmount={amount => setAmountField(amount || '', 'from')}
            coins={getOtherCoins([coinFrom, coinTo])}
            onChangeCoin={(coin: Coin) => setCoins([coin, coinTo])}
          />
        </div>
        <div
          className={style.switchDirection}>
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
            onChangeAmount={amount => setAmountField(amount || '', 'to')}
            coins={getOtherCoins([coinFrom, coinTo])}
            onChangeCoin={(coin: Coin) => setCoins([coinFrom, coin])}
          />
        </div>
        <div onClick={(e) => handleSubmit(e)} className={style.confirmButton}>
          Confirm
        </div>
      </div>
    </div>
  );
};
