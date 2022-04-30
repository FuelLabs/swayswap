import classNames from "classnames";
import { BigNumber, Wallet } from "fuels";
import { useEffect, useState } from "react";
import { RiCheckFill } from "react-icons/ri";
import { useWallet } from "src/context/WalletContext";
import { SwayswapContractAbi__factory } from "src/types/contracts";
import assets from "src/lib/CoinsMetadata";
import { Coin, CoinInput } from "src/components/CoinInput";
import { Spinner } from "src/components/Spinner";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { CONTRACT_ID } from "src/config";
import { PoolInfoStruct } from "src/types/contracts/SwayswapContractAbi";
import { formatUnits } from "ethers/lib/utils";

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
          {step === index && loading && <Spinner />}
          {step > index && <RiCheckFill />}
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
  const [fromAmount, setFromAmount] = useState(null as BigNumber | null);
  const [toAmount, setToAmount] = useState(null as BigNumber | null);
  const [stage, setStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [poolInfo, setPoolInfo] = useState(null as PoolInfoStruct | null);

  useEffect(() => {
    const wallet = getWallet() as Wallet;
    const contract = SwayswapContractAbi__factory.connect(CONTRACT_ID, wallet);

    (async () => {
      const pi = await contract.callStatic.get_info();
      setPoolInfo(pi);
    })();
  }, [getWallet]);

  const provideLiquidity = async () => {
    if (!fromAmount) {
      throw new Error('"fromAmount" is required');
    }
    if (!toAmount) {
      throw new Error('"toAmount" is required');
    }

    const wallet = getWallet() as Wallet;
    const contract = SwayswapContractAbi__factory.connect(CONTRACT_ID, wallet);

    // TODO: Combine all transactions on single tx leverage by scripts
    // https://github.com/FuelLabs/swayswap-demo/issues/42
    setIsLoading(true);
    // Deposit coins from
    setStage(1);
    await contract.functions.deposit({
      forward: [fromAmount, coinFrom.assetId],
    });
    // Deposit coins to
    setStage(2);
    await contract.functions.deposit({
      forward: [toAmount, coinTo.assetId],
    });
    // Create liquidity pool
    setStage(3);
    await contract.functions.add_liquidity(1, toAmount, 1000, {
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
          <div className="mt-6 mb-8 flex justify-center">
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
                onChangeAmount={(amount) => setFromAmount(amount)}
                coins={getOtherCoins([coinFrom, coinTo])}
                onChangeCoin={(coin: Coin) => setCoins([coin, coinTo])}
              />
            </div>
            <div className="mb-10">
              <CoinInput
                coin={coinTo}
                amount={toAmount}
                onChangeAmount={(amount) => setToAmount(amount)}
                coins={getOtherCoins([coinFrom, coinTo])}
                onChangeCoin={(coin: Coin) => setCoins([coinFrom, coin])}
              />
            </div>
            {poolInfo ? (
              <div
                className="mt-3 ml-4 text-slate-400 decoration-1"
                style={{
                  fontFamily: "monospace",
                }}
              >
                Reserves
                <br />
                ETH: {formatUnits(poolInfo.eth_reserve, 9).toString()}
                <br />
                DAI: {formatUnits(poolInfo.token_reserve, 9).toString()}
                <br />
                ETH/DAI:{" "}
                {BigNumber.from(1000)
                  .mul(poolInfo.eth_reserve)
                  .div(poolInfo.token_reserve)
                  .toNumber() / 1000}
                <br />
                DAI/ETH:{" "}
                {BigNumber.from(1000)
                  .mul(poolInfo.token_reserve)
                  .div(poolInfo.eth_reserve)
                  .toNumber() / 1000}
              </div>
            ) : null}
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
