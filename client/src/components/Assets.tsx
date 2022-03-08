import { useContext, useEffect, useState } from "react";
import { FaFaucet } from "react-icons/fa";
import { WalletContext } from "../context/WalletContext";
import { Coin, CoinStatus } from "fuels";
import coinList from "../lib/assets.json";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-3xl border border-[#20242A] 
    flex justify-between`,
  transferPropInput: `bg-transparent flex items-center placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] 
    rounded-2xl text-xl font-medium p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  faucetButton: `hover:bg-[#41444F] cursor-pointer p-1 rounded-xl`,
};

const transformCoinsToAssets = (coins: Coin[]) => {
  return coinList.map((coinItem) => {
    const total = coins.reduce((total, coin) => {
      if (coin.assetId === coinItem.assetId) {
        if (coin.status === CoinStatus.Unspent) {
          return total.add(coin.amount);
        } else if (coin.status === CoinStatus.Spent) {
          return total.sub(coin.amount);
        }
      }
      return total;
    }, BigNumber.from(0));
    return {
      ...coinItem,
      amount: total,
    };
  });
};

export const Assets = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const { faucet, getCoins, getWallet } = useContext(WalletContext);
  const wallet = getWallet();

  const loadCoins = () => {
    getCoins().then((coins) => {
      setCoins(coins);
    });
  };

  useEffect(() => {
    if (wallet?.address) loadCoins();
  }, [wallet?.address]);

  const handleClickFaucet = async () => {
    await faucet();
    loadCoins();
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Assets</div>
          <div className={style.faucetButton} onClick={handleClickFaucet}>
            {/* TODO: Add loading state */}
            <FaFaucet />
          </div>
        </div>

        {transformCoinsToAssets(coins).map((coinData) => (
          <div className={style.transferPropContainer} key={coinData.assetId}>
            <div className={style.transferPropInput}>
              <span>{formatEther(coinData.amount)}</span>
            </div>

            <div className={style.currencySelector}>
              <div className={style.currencySelectorContent}>
                <div className={style.currencySelectorIcon}>
                  <img
                    src={coinData.img}
                    alt={coinData.name}
                    height={20}
                    width={20}
                  />
                </div>
                <div className={style.currencySelectorTicker}>
                  {coinData.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
