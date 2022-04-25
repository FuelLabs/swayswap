import classNames from "classnames";
import { parseUnits } from "ethers/lib/utils";
import { InputType, Wallet } from "fuels";
import { useState } from "react";
import { RiCheckFill } from "react-icons/ri";
import { useWallet } from "src/context/WalletContext";
import { SwayswapContractAbi__factory } from "src/types/contracts";
import assets from "src/lib/CoinsMetadata";
import { Coin, CoinInput } from "src/components/CoinInput";
import { Spinner } from "src/components/Spinner";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";

const { REACT_APP_CONTRACT_ID } = process.env;

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
};

function PoolLoader({
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
          key={index}
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
  const navigate = useNavigate();
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

    // TODO: Combine all transactions on single tx leverage by scripts
    // https://github.com/FuelLabs/swayswap-demo/issues/42
    setIsLoading(true);
    // Deposit coins from
    {
      setStage(1);
      const amount = parseUnits(fromAmount, 9);
      await contract.functions.deposit({
        assetId: coinFrom.assetId,
        amount,
        transformRequest: async (request) => {
          // TODO: Remove after solving issues with duplicate inputs
          request.inputs = request.inputs.filter(i => {
            return !(i.type === InputType.Coin && i.assetId === coinFrom.assetId);
          });
          const coins = await wallet.getCoinsToSpend([[amount, coinFrom.assetId]]);
          request.addCoins(coins);
          return request;
        },
      });
    }
    // Deposit coins to
    {
      setStage(2);
      const amount = parseUnits(toAmount, 9);
      const coins = await wallet.getCoinsToSpend([[amount, coinTo.assetId]]);
      await contract.functions.deposit({
        assetId: coinTo.assetId,
        amount,
        transformRequest: async (request) => {
          request.addCoins(coins);
          return request;
        },
      });
    }
    // Create liquidity pool
    setStage(3);
    await contract.functions.add_liquidity(1, parseUnits(toAmount, 9), 1000, {
      variableOutputs: 1,
    });
    // We are done, reset
    setStage(0);
    setIsLoading(false);
    // TODO: Improve feedback after add liquidity
    // 
    navigate(Pages.assets);
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
