import { useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import assets from "../lib/assets.json";
import { Coin, CoinInput } from "./CoinInput";
import { InvertButton } from "./InvertButton";
const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-3xl border border-[#20242A] 
    flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,

  // coin selector
  currencySelector: `flex w-1/4`,
  currencySelectorMenuButton: `inline-flex justify-around w-full px-4 py-2 text-sm font-medium text-white 
    bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`,
  currencySelectorMenuItems: `absolute w-full mt-2 bg-[#191B1F] divide-gray-100 
    rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorItem: `flex justify-around rounded-md w-full px-2 py-2 text-sm`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] 
    rounded-2xl text-xl font-medium p-2 mt-[-0.2rem]`,
    currencySelectorTicker: `mx-2`,
  menuWrapper: `px-1 py-1`,

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
