import classNames from "classnames";
import { useState } from "react";
import { RiCheckFill } from "react-icons/ri";
import { useContract } from "src/context/AppContext";
import assets from "src/lib/CoinsMetadata";
import { Coin, CoinInput, useCoinInput } from "src/components/CoinInput";
import { Spinner } from "src/components/Spinner";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { formatUnits } from "ethers/lib/utils";
import { DECIMAL_UNITS, ONE_ASSET } from "src/config";
import { useMutation, useQuery } from "react-query";
import { useTokenMethods } from "src/lib/tokens";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4 m-2`,
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

export default function PoolPage() {
  const contract = useContract()!;
  const navigate = useNavigate();
  const getOtherCoins = (coins: Coin[]) =>
    assets.filter(({ assetId }) => !coins.find((c) => c.assetId === assetId));

  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);

  const [stage, setStage] = useState(0);
  const { data: poolInfo } = useQuery("PoolPage-poolInfo", () =>
    contract.callStatic.get_info()
  );

  const fromMethods = useTokenMethods(coinFrom.assetId);
  const fromInput = useCoinInput({
    coin: coinFrom,
    coins: getOtherCoins([coinFrom, coinTo]),
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
  });

  const toMethods = useTokenMethods(coinTo.assetId);
  const toInput = useCoinInput({
    coin: coinTo,
    coins: getOtherCoins([coinTo, coinTo]),
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
  });

  const addLiquidityMutation = useMutation(
    async () => {
      const fromAmount = fromInput.value.parsed;
      const toAmount = toInput.value.parsed;

      if (!fromAmount) {
        throw new Error('"fromAmount" is required');
      }
      if (!toAmount) {
        throw new Error('"toAmount" is required');
      }

      const coinFromBalance = await fromMethods.getBalance();
      const coinToBalance = await toMethods.getBalance();
      const hasBalance =
        coinFromBalance >= fromAmount && coinToBalance >= toAmount;
      console.log(hasBalance);

      // TODO: Combine all transactions on single tx leverage by scripts
      // https://github.com/FuelLabs/swayswap-demo/issues/42

      // Deposit coins from
      await contract.functions.deposit({
        forward: [fromAmount, coinFrom.assetId],
      });
      setStage((s) => s + 1);
      // Deposit coins to
      await contract.functions.deposit({
        forward: [toAmount, coinTo.assetId],
      });
      setStage((s) => s + 1);
      // Create liquidity pool
      await contract.functions.add_liquidity(1, toAmount, 1000, {
        variableOutputs: 1,
      });
      setStage((s) => s + 1);
    },
    {
      onSuccess: () => {
        // TODO: Improve feedback after swap
        navigate(Pages.wallet);
      },
      onSettled: () => {
        setStage(0);
      },
    }
  );

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Pool</h1>
        </div>
        {addLiquidityMutation.isLoading ? (
          <div className="mt-6 mb-8 flex justify-center">
            <PoolLoader
              steps={[
                `Deposit: ${coinFrom.name}`,
                `Deposit: ${coinTo.name}`,
                `Provide liquidity`,
                `Done`,
              ]}
              step={stage}
              loading={addLiquidityMutation.isLoading}
              coinFrom={coinFrom}
              coinTo={coinTo}
            />
          </div>
        ) : (
          <>
            <div className="mt-6 mb-4">
              <CoinInput {...fromInput.getInputProps()} />
            </div>
            <div className="mb-10">
              <CoinInput {...toInput.getInputProps()} />
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
                ETH:{" "}
                {formatUnits(poolInfo.eth_reserve, DECIMAL_UNITS).toString()}
                <br />
                DAI:{" "}
                {formatUnits(poolInfo.token_reserve, DECIMAL_UNITS).toString()}
                {poolInfo.eth_reserve > 0 && poolInfo.token_reserve > 0 ? (
                  <>
                    <br />
                    ETH/DAI:{" "}
                    {(ONE_ASSET * poolInfo.eth_reserve) /
                      poolInfo.token_reserve /
                      ONE_ASSET}
                    <br />
                    DAI/ETH:{" "}
                    {(ONE_ASSET * poolInfo.token_reserve) /
                      poolInfo.eth_reserve /
                      ONE_ASSET}
                  </>
                ) : null}
              </div>
            ) : null}
            <div
              onClick={() => addLiquidityMutation.mutate()}
              className={style.confirmButton}
            >
              Confirm
            </div>
          </>
        )}
      </div>
    </div>
  );
}
