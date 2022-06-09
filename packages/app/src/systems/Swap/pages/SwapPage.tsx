import { useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdSwapCalls } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

import { SwapComponent, SwapPreview, PricePerToken } from "../components";
import { swapHasSwappedAtom } from "../state";
import type { SwapState, SwapInfo } from "../types";
import { ValidationStateEnum } from "../types";
import {
  hasReserveAmount,
  queryPreviewAmount,
  swapTokens,
  getValidationState,
  getValidationText,
} from "../utils";

import {
  useDebounce,
  useBalances,
  useContract,
  useSlippage,
  ZERO,
  isSwayInfinity,
} from "~/systems/Core";
import { usePoolInfo, useUserPositions } from "~/systems/Pool";
import { Button, Card } from "~/systems/UI";
import type { PreviewInfo } from "~/types/contracts/ExchangeContractAbi";

export function SwapPage() {
  const contract = useContract()!;
  const [previewInfo, setPreviewInfo] = useState<PreviewInfo | null>(null);
  const [swapState, setSwapState] = useState<SwapState | null>(null);
  const [hasLiquidity, setHasLiquidity] = useState(true);
  const debouncedState = useDebounce(swapState);
  const { data: poolInfo } = usePoolInfo();

  const previewAmount = previewInfo?.amount || ZERO;
  const swapInfo = useMemo<SwapInfo>(
    () => ({
      ...poolInfo,
      ...previewInfo,
      ...swapState,
      previewAmount,
    }),
    [poolInfo, previewInfo, swapState]
  );

  const slippage = useSlippage();
  const balances = useBalances();
  const setHasSwapped = useSetAtom(swapHasSwappedAtom);
  const { poolRatio } = useUserPositions();

  const { isLoading } = useQuery(
    [
      "SwapPage-inactiveAmount",
      debouncedState?.amount?.toString(),
      debouncedState?.direction,
      debouncedState?.coinFrom.assetId,
      debouncedState?.coinTo.assetId,
    ],
    async () => {
      // This is a hard coded solution, need to be dynamic in future
      if (!poolRatio) {
        setHasLiquidity(false);
        return;
      }

      if (!debouncedState?.amount) return null;
      if (!hasReserveAmount(debouncedState, poolInfo)) return null;
      return queryPreviewAmount(contract, debouncedState);
    },
    {
      onSuccess: (preview) => {
        if (preview == null) {
          setPreviewInfo(null);
        } else if (isSwayInfinity(preview.amount)) {
          setPreviewInfo(null);
          setHasLiquidity(false);
        } else {
          setHasLiquidity(preview.has_liquidity);
          setPreviewInfo(preview);
        }
      },
    }
  );

  const { mutate: swap, isLoading: isSwaping } = useMutation(
    async () => {
      if (!swapState) return;
      return swapTokens(contract, swapState);
    },
    {
      onSuccess: async () => {
        setHasSwapped(true);
        toast.success("Swap made successfully!");
        await balances.refetch();
      },
    }
  );

  function handleSwap(state: SwapState) {
    setSwapState(state);
  }

  const validationState = getValidationState({
    swapState,
    previewAmount,
    hasLiquidity,
    balances: balances.data,
    slippage: slippage.value,
  });

  const shouldDisableSwap =
    isLoading || validationState !== ValidationStateEnum.Swap;

  const btnText = getValidationText(validationState, swapState);

  return (
    <Card className="sm:min-w-[450px]">
      <Card.Title>
        <MdSwapCalls className="text-primary-500" />
        Swap
      </Card.Title>
      <SwapComponent
        previewAmount={previewAmount}
        onChange={handleSwap}
        isLoading={isLoading}
      />
      <SwapPreview isLoading={isLoading} swapInfo={swapInfo} />
      <PricePerToken
        swapState={swapState}
        previewAmount={previewAmount}
        isLoading={isLoading}
      />
      <Button
        aria-label="swap-submit-button"
        isFull
        isLoading={isSwaping}
        size="lg"
        variant="primary"
        isDisabled={shouldDisableSwap}
        onPress={() => swap()}
        aria-label="Swap button"
      >
        {btnText}
      </Button>
    </Card>
  );
}
