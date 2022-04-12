import { useContext, useEffect, useState } from "react";
import { FaFaucet } from "react-icons/fa";
import { WalletContext } from "../context/WalletContext";
import { Coin, CoinQuantity, CoinStatus } from "fuels";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import urlJoin from "url-join";
import { CoinInput } from "./CoinInput";
import assets from "../lib/assets.json";
import { Spinner } from "./Spinner";

const { PUBLIC_URL } = process.env;


// <div className={style.transferPropContainer} key={coinData.assetId}>
// <div className={style.transferPropInput}>
//   <span>{formatUnits(coinData.amount, 9)}</span>
// </div>
// 
// <div className={style.currencySelector}>
//   <div className={style.currencySelectorContent}>
//     <div className={style.currencySelectorIcon}>
//       <img
//         src={urlJoin(PUBLIC_URL, coinData.img)}
//         alt={coinData.name}
//         height={20}
//         width={20}
//       />
//     </div>
//     <div className={style.currencySelectorTicker}>
//       {coinData.name}
//     </div>
//   </div>
// </div>
// </div>

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl mb-8`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-3xl border border-[#20242A] 
    flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] 
    rounded-2xl text-xl font-medium p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  faucetButton: `hover:bg-[#41444F] cursor-pointer p-1 rounded-xl flex justify-center`,
};

const transformCoinsToAssets = (coins: CoinQuantity[]) => {
  return assets.map((coinItem) => {
    const coin = coins.find(c => c.assetId === coinItem.assetId);
    return {
      ...coinItem,
      amount: coin?.amount || 0
    };
  });
};

export const Assets = () => {
  const [coins, setCoins] = useState<CoinQuantity[]>([]);
  const { faucet, getCoins, getWallet } = useContext(WalletContext);
  const wallet = getWallet();
  const [isLoading, setLoading] = useState(false);

  // Load balances
  const loadCoins = async () => {
    return getCoins().then((coins) => {
      setCoins(coins);
    });
  };

  const handleClickFaucet = async () => {
    setLoading(true);
    try {
      await faucet();
      await loadCoins();
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (wallet?.address) loadCoins();
  }, [wallet?.address]);

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Assets</div>
          <div className="p-1 rounded-xl flex justify-center w-10">
            {isLoading ? (
              <div className="p-1 rounded-xl flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div className={style.faucetButton} onClick={handleClickFaucet}>
                <FaFaucet />
              </div>
            )}
          </div>
        </div>

        {transformCoinsToAssets(coins).map((coin) => {
          const current = assets.find(a => a.assetId === coin.assetId);
          return (
            <div className="my-4" key={coin.assetId}>
              <CoinInput
                coin={current}
                disabled={true}
                amount={formatUnits(coin.amount, 9)}
                coins={current ? [current] : []}
              />
            </div>
          )
        })}
      </div>
    </div>
  );
};
