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
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
};

export default function SwapPage() {
  const contract = useContract()!;
  const [previewAmount, setPreviewAmount] = useState<bigint | null>(null);
  const [swapState, setSwapState] = useState<SwapState | null>(null);
  const debouncedState = useDebounce(swapState);
  const navigate = useNavigate();

  const { isLoading } = useQuery<bigint | null>(
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
        setPreviewAmount(value);
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
        // TODO: Improve feedback after swap
        navigate(Pages.wallet);
      },
    }
  );

  const shouldDisableButton = isLoading || isSwaping || !swapState;

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Swap</h1>
          <div>{/* <RiSettings3Fill /> */}</div>
        </div>
        <SwapComponent previewAmount={previewAmount} onChange={setSwapState} />
        <Button disabled={shouldDisableButton} onClick={() => swap()}>
          {isSwaping ? "Loading..." : "Swap"}
        </Button>
      </div>
    </div>
  );
}
