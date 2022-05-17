/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState } from "react";
import assets from "src/lib/CoinsMetadata";
import { Coin, CoinInput, useCoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { useContract } from "src/context/AppContext";
import { ExchangeContractAbi } from "src/types/contracts";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { useMutation, useQuery } from "react-query";
import { sleep } from "src/lib/utils";
import { formatUnits } from "ethers/lib/utils";
import { DECIMAL_UNITS } from "src/config";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
  switchDirection: `flex items-center justify-center -my-3`,
};

const DEADLINE = 1000;

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

type ActiveInput = "from" | "to" | null;

export default function SwapPage() {
  const contract = useContract()!;
  const navigate = useNavigate();

  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);

  const getOtherCoins = (coins: Coin[]) =>
    assets.filter(({ assetId }) => !coins.find((c) => c.assetId === assetId));

  const [fromAmountStr, setFromAmount] = useState<string | undefined>();
  const [toAmountStr, setToAmount] = useState<string | undefined>();
  const [activeInput, setActiveInput] = useState<ActiveInput>(null);

  const { data: inactiveAmount } = useQuery(
    ["SwapPage-inactiveAmount", activeInput, toAmountStr, fromAmountStr],
    async () => {
      if (activeInput === "to") {
        if (!toAmount) return null;
        const amount = await getSwapWithMaximumRequiredAmount(
          contract,
          coinFrom.assetId,
          toAmount
        );
        return formatUnits(amount, DECIMAL_UNITS);
      }

      if (activeInput === "from") {
        if (!fromAmount) return null;
        const amount = await getSwapWithMinimumMinAmount(
          contract,
          coinFrom.assetId,
          fromAmount
        );
        return formatUnits(amount, DECIMAL_UNITS);
      }

      return null;
    }
  );

  const fromInput = useCoinInput({
    coin: coinFrom,
    coins: getOtherCoins([coinFrom, coinTo]),
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    amount: activeInput === "from" ? fromAmountStr : inactiveAmount?.toString(),
    onChange: setFromAmount,
    onInput: () => {
      setActiveInput("from");
    },
  });

  const toInput = useCoinInput({
    coin: coinTo,
    coins: getOtherCoins([coinFrom, coinTo]),
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    amount: activeInput === "to" ? toAmountStr : inactiveAmount?.toString(),
    onChange: setToAmount,
    onInput: () => {
      setActiveInput("to");
    },
  });

  const fromAmount = fromInput.value.parsed;
  const toAmount = toInput.value.parsed;

  function handleInvert() {
    setFromAmount(toInput.value.raw);
    setCoins([coinTo, coinFrom]);
  }

  const swapMutation = useMutation(
    async () => {
      if (!fromAmount) {
        throw new Error('"fromAmount" is required');
      }
      if (!toAmount) {
        throw new Error('"toAmount" is required');
      }
      if (activeInput !== "to" && activeInput !== "from") {
        throw new Error(`Invalid mode "${activeInput}"`);
      }

      if (activeInput === "to") {
        const forwardAmount = await getSwapWithMaximumRequiredAmount(
          contract,
          coinFrom.assetId,
          toAmount
        );
        await contract.functions.swap_with_maximum(toAmount, DEADLINE, {
          forward: [forwardAmount, coinFrom.assetId],
          variableOutputs: 1,
        });
      }

      if (activeInput === "from") {
        const minValue = await getSwapWithMinimumMinAmount(
          contract,
          coinFrom.assetId,
          fromAmount
        );
        await contract.functions.swap_with_minimum(minValue, DEADLINE, {
          forward: [fromAmount, coinFrom.assetId],
          variableOutputs: 1,
        });
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
          <CoinInput {...fromInput.getInputProps()} />
        </div>
        <div className={style.switchDirection}>
          <InvertButton onClick={handleInvert} />
        </div>
        <div className="mb-10">
          <CoinInput {...toInput.getInputProps()} />
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
