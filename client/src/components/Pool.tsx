import classNames from "classnames";
import { parseUnits } from "ethers/lib/utils";
import { Wallet } from "fuels";
import { useState } from "react";
import { RiCheckFill } from "react-icons/ri";
import { useWallet } from "src/context/WalletContext";
import { SwayswapContractAbi__factory } from "src/types/fuels-contracts";
import assets from "../lib/assets.json";
import { Coin, CoinInput } from "./CoinInput";
import { Spinner } from "./Spinner";

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
  switchDirection: `flex items-center justify-center -my-3`,
};

const { REACT_APP_CONTRACT_ID } = process.env;

function PoolLoader({
  coinFrom,
  coinTo,
  loading,
  step,
  steps,
}: {
  coinFrom: Coin;
  coinTo: Coin;
  loading: boolean;
  step: number;
  steps: string[];
}) {
  return (
    <ul className="w-full rounded-lg border border-[#2b3039] text-gray-900">
      {steps.map((stepText, index) => (
        <li
          className={classNames(
            "space-between flex w-full items-center border-b border-[#2b3039] px-6 py-2 text-white",
            {
              "rounded-t-lg": index === 0,
              "bg-[#58c09a]": step === index && loading,
              "rounded-b-lg": index === steps.length,
            }
          )}
        >
          <div className="flex-1">{stepText}</div>
          {(step === index && loading) && <Spinner />}
          {(step > index) && <RiCheckFill />}
        </li>
      ))}
    </ul>
  );
}

export const Pool = () => {
  const { getWallet } = useWallet();
  const getOtherCoins = (coins: Coin[]) =>
    assets.filter(({ assetId }) => !coins.find((c) => c.assetId === assetId));
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [stage, setStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const provideLiquidity = async () => {
    const wallet = getWallet() as Wallet;
    const contract = SwayswapContractAbi__factory.connect(
      REACT_APP_CONTRACT_ID,
      wallet
    );

    setIsLoading(true);
    setStage(1);
    await contract.functions.deposit({
        assetId: coinFrom.assetId,
        amount: parseUnits(fromAmount, 9)
    });
    setStage(2);
    await contract.functions.deposit({
        assetId: coinTo.assetId,
        amount: parseUnits(toAmount, 9)
    });
    setStage(3);
    await contract.functions.add_liquidity(1, parseUnits(toAmount, 9), 1000);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Pool</h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center mt-6 mb-8">
            <PoolLoader
              steps={[
                `Deposit: ${coinFrom.name}`,
                `Deposit: ${coinTo.name}`,
                `Provide liquidity`,
                `Done`,
              ]}
              step={stage}
              loading={isLoading}
              coinFrom={coinFrom}
              coinTo={coinTo}
            />
          </div>
        ) : (
          <>
            <div className="mt-6 mb-4">
              <CoinInput
                coin={coinFrom}
                amount={fromAmount}
                onChangeAmount={(amount) => setFromAmount(amount || "")}
                coins={getOtherCoins([coinFrom, coinTo])}
                onChangeCoin={(coin: Coin) => setCoins([coin, coinTo])}
              />
            </div>
            <div className="mb-10">
              <CoinInput
                coin={coinTo}
                amount={toAmount}
                onChangeAmount={(amount) => setToAmount(amount || "")}
                coins={getOtherCoins([coinFrom, coinTo])}
                onChangeCoin={(coin: Coin) => setCoins([coinFrom, coin])}
              />
            </div>
            <div
              onClick={(e) => provideLiquidity()}
              className={style.confirmButton}
            >
              Confirm
            </div>
          </>
        )}
      </div>
    </div>
  );
};
