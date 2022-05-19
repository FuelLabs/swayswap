import type { CoinQuantity } from "fuels";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdSwapCalls } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import { SwapComponent } from "./SwapComponent";
import { queryPreviewAmount, swapTokens } from "./queries";
import type { SwapState } from "./types";
import { ActiveInput } from "./types";

import { Button } from "~/components/Button";
import { PageContent } from "~/components/PageContent";
import { useContract } from "~/context/AppContext";
import { useBalances } from "~/hooks/useBalances";
import useDebounce from "~/hooks/useDebounce";
import { sleep } from "~/lib/utils";
import { Pages } from "~/types/pages";

const getBalanceAsset = (
  balances: CoinQuantity[] | undefined,
  assetId: string
) => balances?.find((item) => item.assetId === assetId);

export default function SwapPage() {
  const contract = useContract()!;
  const [previewAmount, setPreviewAmount] = useState<bigint | null>(null);
  const [swapState, setSwapState] = useState<SwapState | null>(null);
  const [hasLiquidity, setHasLiquidity] = useState(true);
  const debouncedState = useDebounce(swapState);
  const { data: balances } = useBalances();
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
      if (!debouncedState?.amount) return null;
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

  const hasNotBalance =
    !swapState ||
    !swapState.amount ||
    !getBalanceAsset(
      balances,
      swapState.direction === ActiveInput.to ? swapState.to : swapState.from
    );
  const shouldDisableButton =
    isLoading || isSwaping || !hasLiquidity || !previewAmount || hasNotBalance;

  const getButtonText = () => {
    if (!hasLiquidity) return "Insufficient liquidity";
    if (isSwaping) return "Loading...";
    return "Swap";
  };

  return (
    <PageContent>
      <PageContent.Title>
        <MdSwapCalls className="text-primary-500" />
        Swap
      </PageContent.Title>
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
    </PageContent>
  );
}
