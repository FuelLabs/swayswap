import toast from "react-hot-toast";
import { useState } from "react";
import { useContract } from "src/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { useMutation, useQuery } from "react-query";
import { sleep } from "src/lib/utils";
import { queryPreviewAmount, swapTokens } from "./queries";
import { SwapState } from "./types";
import { Button } from "src/components/Button";
import useDebounce from "src/hooks/useDebounce";
import { SwapComponent } from "./SwapComponent";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-gray-800 w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
};

export default function SwapPage() {
  const contract = useContract()!;
  const [previewAmount, setPreviewAmount] = useState<bigint | null>(null);
  const [swapState, setSwapState] = useState<SwapState | null>(null);
  const [hasLiquidity, setHasLiquidity] = useState(true);
  const debouncedState = useDebounce(swapState);
  const navigate = useNavigate();

  const { isLoading } = useQuery(
    [
      "SwapPage-inactiveAmount",
      debouncedState?.amount?.toString(),
      debouncedState?.direction,
      debouncedState?.from,
      debouncedState?.to,
    ],
    async () => {
      if (!debouncedState) return null;
      return queryPreviewAmount(contract, debouncedState);
    },
    {
      onSuccess: (value) => {
        if (value == null) return;
        setPreviewAmount(value.amount);
        setHasLiquidity(value.has_liquidity);
      },
    }
  );
  const { mutate: swap, isLoading: isSwaping } = useMutation(
    async () => {
      if (!swapState) return;
      await swapTokens(contract, swapState);
      await sleep(1000);
    },
    {
      onSuccess: () => {
        toast.success("Swap made successfully!");
        navigate(Pages.wallet);
      },
    }
  );

  const shouldDisableButton =
    isLoading || isSwaping || !swapState || !hasLiquidity || !previewAmount;

  const getButtonText = () => {
    if (!hasLiquidity) return "Insufficient liquidity";
    if (isSwaping) return "Loading...";
    return "Swap";
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Swap</h1>
        </div>
        <SwapComponent previewAmount={previewAmount} onChange={setSwapState} />
        <Button
          isFull
          size="lg"
          variant="primary"
          isDisabled={shouldDisableButton}
          onPress={() => swap()}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
