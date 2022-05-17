import { useState } from "react";
import assets from "src/lib/CoinsMetadata";
import { Coin, CoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { useContract } from "src/context/AppContext";
import { ExchangeContractAbi } from "src/types/contracts";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { useMutation, useQuery } from "react-query";
import { sleep } from "src/lib/utils";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
  switchDirection: `flex items-center justify-center -my-3`,
};

const getSwapWithMaximumRequiredAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: bigint
) => {
  const requiredAmount = await contract.callStatic.get_swap_with_maximum(
    amount,
    {
      forward: [0, assetId],
    }
  );
  return requiredAmount;
};

const getSwapWithMinimumMinAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: bigint
) => {
  const minAmount = await contract.callStatic.get_swap_with_minimum(amount, {
    forward: [0, assetId],
  });
  return minAmount;
};

export default function SwapPage() {
  const contract = useContract()!;
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);
  const getOtherCoins = (coins: Coin[]) =>
    assets.filter(({ assetId }) => !coins.find((c) => c.assetId === assetId));
  const [fromAmount, setFromAmount] = useState<bigint | null>(null);
  const [toAmount, setToAmount] = useState<bigint | null>(null);
  const [activeInput, setActiveInput] = useState(null as "from" | "to" | null);
  const navigate = useNavigate();

  const { data: inactiveAmount } = useQuery(
    ["SwapPage-inactiveAmount", activeInput, toAmount?.toString(), fromAmount?.toString()],
    async () => {
      if (activeInput === "to") {
        if (!toAmount) return null;
        return await getSwapWithMaximumRequiredAmount(
          contract,
          coinFrom.assetId,
          toAmount
        );
      } else if (activeInput === "from") {
        if (!fromAmount) return null;
        return await getSwapWithMinimumMinAmount(
          contract,
          coinFrom.assetId,
          fromAmount
        );
      } else {
        return null;
      }
    }
  );

  const swapMutation = useMutation(
    async () => {
      if (!fromAmount) {
        throw new Error('"fromAmount" is required');
      }
      if (!toAmount) {
        throw new Error('"toAmount" is required');
      }

      const deadline = 1000;

      if (activeInput === "to") {
        const forwardAmount = await getSwapWithMaximumRequiredAmount(
          contract,
          coinFrom.assetId,
          toAmount
        );
        await contract.functions.swap_with_maximum(toAmount, deadline, {
          forward: [forwardAmount, coinFrom.assetId],
          variableOutputs: 1,
        });
      } else if (activeInput === "from") {
        const minValue = await getSwapWithMinimumMinAmount(
          contract,
          coinFrom.assetId,
          fromAmount
        );
        await contract.functions.swap_with_minimum(minValue, deadline, {
          forward: [fromAmount, coinFrom.assetId],
          variableOutputs: 1,
        });
      } else {
        throw new Error(`Invalid mode "${activeInput}"`);
      }
      await sleep(1000);
    },
    {
      onSuccess: () => {
        // TODO: Improve feedback after swap
        navigate(Pages.wallet);
      },
    }
  );

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Swap</h1>
          <div>{/* <RiSettings3Fill /> */}</div>
        </div>

        <div className="mt-6">
          <CoinInput
            coin={coinFrom}
            amount={activeInput === "from" ? fromAmount : inactiveAmount}
            onInput={() => setActiveInput("from")}
            onChangeAmount={(amount) => {
              if (activeInput === "from") setFromAmount(amount);
            }}
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
            amount={activeInput === "to" ? toAmount : inactiveAmount}
            onInput={() => setActiveInput("to")}
            onChangeAmount={(amount) => {
              if (activeInput === "to") setToAmount(amount);
            }}
            coins={getOtherCoins([coinFrom, coinTo])}
            onChangeCoin={(coin: Coin) => setCoins([coinFrom, coin])}
          />
        </div>
        <div
          onClick={() => swapMutation.mutate()}
          className={style.confirmButton}
        >
          Confirm
        </div>
      </div>
    </div>
  );
}
