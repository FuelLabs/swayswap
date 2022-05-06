import { useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import { assets } from "src/lib/SwaySwapMetadata";
import { Coin, CoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { useExchangeContract } from "src/context/AppContext";
import { ExchangeContractAbi } from "src/types/contracts";
import { BigNumber } from "fuels";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { EXCHANGE_CONTRACT_ID } from "src/config";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
  switchDirection: `flex items-center justify-center -my-3`,
};

const getSwapWithMaximumForwardAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: BigNumber
) => {
  const forwardAmount =
    await contract.callStatic.swap_with_maximum_forward_amount(amount, {
      forward: [1, assetId],
    });
  return forwardAmount;
};

const getSwapWithMinimumMinValue = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: BigNumber
) => {
  const minValue = await contract.callStatic.swap_with_minimum_min_value(
    amount,
    {
      forward: [1, assetId],
    }
  );
  return minValue;
};

export default function SwapPage() {
  const contract = useExchangeContract(EXCHANGE_CONTRACT_ID)!;
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);
  const getOtherCoins = (coins: Coin[]) =>
    assets.filter(({ assetId }) => !coins.find((c) => c.assetId === assetId));
  const [fromAmount, setFromAmount] = useState(null as BigNumber | null);
  const [toAmount, setToAmount] = useState(null as BigNumber | null);
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    if (!fromAmount) {
      throw new Error('"fromAmount" is required');
    }
    if (!toAmount) {
      throw new Error('"toAmount" is required');
    }

    const deadline = 1000;

    if (mode === "with_maximum") {
      const forwardAmount = await getSwapWithMaximumForwardAmount(
        contract,
        coinFrom.assetId,
        toAmount
      );
      await contract.functions.swap_with_maximum(toAmount, deadline, {
        forward: [forwardAmount, coinFrom.assetId],
        variableOutputs: 1,
      });
    } else if (mode === "with_minimum") {
      const minValue = await getSwapWithMinimumMinValue(
        contract,
        coinFrom.assetId,
        fromAmount
      );
      await contract.functions.swap_with_minimum(minValue, deadline, {
        forward: [fromAmount, coinFrom.assetId],
        variableOutputs: 1,
      });
    } else {
      throw new Error(`Invalid mode "${mode}"`);
    }

    // TODO: Improve feedback after swap
    //
    navigate(Pages.assets);
  };

  const setAmountField = (amount: BigNumber | null, field: "from" | "to") => {
    if (field === "from" && mode !== "with_maximum") {
      setFromAmount(amount);

      if (amount) {
        setIsLoading(true);
        (async () => {
          const minValue = await getSwapWithMinimumMinValue(
            contract,
            coinFrom.assetId,
            amount
          );

          setToAmount(minValue);
        })().finally(() => setIsLoading(false));
      }
    } else if (field === "to" && mode !== "with_minimum") {
      setToAmount(amount);

      if (amount) {
        setIsLoading(true);
        (async () => {
          const forwardAmount = await getSwapWithMaximumForwardAmount(
            contract,
            coinFrom.assetId,
            amount
          );

          setFromAmount(forwardAmount);
        })().finally(() => setIsLoading(false));
      }
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
          <CoinInput
            coin={coinFrom}
            amount={fromAmount}
            onInput={() => setMode("with_minimum")}
            onChangeAmount={(amount) => setAmountField(amount, "from")}
            coins={getOtherCoins([coinFrom, coinTo])}
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
            onInput={() => setMode("with_maximum")}
            onChangeAmount={(amount) => setAmountField(amount, "to")}
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
}
