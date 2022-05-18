import { useRef, useState } from "react";
import assets from "src/lib/CoinsMetadata";
import { Coin, CoinInput, useCoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { useContract } from "src/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { useMutation, useQuery } from "react-query";
import { sleep } from "src/lib/utils";
import { queryPreviewAmount, swapTokens } from "./queries";
import { ActiveInput } from "./types";
import { Button } from "src/components/Button";
import { toBigInt } from "fuels";
import useDebounce from "src/hooks/useDebounce";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
  switchDirection: `flex items-center justify-center -my-3`,
};

const getOtherCoins = (coins: Coin[]) =>
  assets.filter(({ assetId }) => !coins.find((c) => c.assetId === assetId));

export default function SwapPage() {
  const contract = useContract()!;
  const navigate = useNavigate();
  // States
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);
  const activeInput = useRef<ActiveInput>(ActiveInput.from);
  const [previewAmount, setPreviewAmount] = useState<bigint | null>(null);
  const [value, setValue] = useState<bigint | null>(null);
  const debouncedValue = useDebounce(value);

  const handleInput = (inputType: ActiveInput) => () => {
    if (activeInput.current !== inputType) {
      setPreviewAmount(toBigInt(0));
    }
    activeInput.current = inputType;
  };

  const handleChange = (inputType: ActiveInput) => (amount: bigint | null) => {
    if (activeInput.current === inputType) {
      setValue(amount);
    }
  };

  const getInputValue = (inputType: ActiveInput) => {
    return activeInput.current === inputType ? value : previewAmount;
  };

  const handleInvertCoins = () => {
    activeInput.current =
      activeInput.current === ActiveInput.to
        ? ActiveInput.from
        : ActiveInput.to;
    setPreviewAmount(toBigInt(0));
    setCoins([coinTo, coinFrom]);
  };

  const fromInput = useCoinInput({
    coin: coinFrom,
    coins: getOtherCoins([coinFrom, coinTo]),
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    amount: getInputValue(ActiveInput.from),
    onChange: handleChange(ActiveInput.from),
    onInput: handleInput(ActiveInput.from),
  });

  const toInput = useCoinInput({
    coin: coinTo,
    coins: getOtherCoins([coinFrom, coinTo]),
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    amount: getInputValue(ActiveInput.to),
    onChange: handleChange(ActiveInput.to),
    onInput: handleInput(ActiveInput.to),
  });

  const { isLoading } = useQuery<bigint | null>(
    ["SwapPage-inactiveAmount", coinFrom, coinTo, debouncedValue?.toString()],
    async () => {
      const result = await queryPreviewAmount(contract, {
        from: coinFrom.assetId,
        to: coinTo.assetId,
        amount: value,
        direction: activeInput.current,
      });
      return result;
    },
    {
      onSuccess: (value) => {
        setPreviewAmount(value);
      },
    }
  );

  const { mutate: swap, isLoading: isSwaping } = useMutation(
    async () => {
      await swapTokens(contract, {
        from: coinFrom.assetId,
        to: coinTo.assetId,
        amount: fromInput.amount,
        direction: activeInput.current,
      });
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
          <InvertButton onClick={handleInvertCoins} />
        </div>
        <div className="mb-10">
          <CoinInput {...toInput.getInputProps()} />
        </div>
        <Button disabled={isLoading || isSwaping} onClick={() => swap()}>
          {isSwaping ? "Loading..." : "Swap"}
        </Button>
      </div>
    </div>
  );
}
