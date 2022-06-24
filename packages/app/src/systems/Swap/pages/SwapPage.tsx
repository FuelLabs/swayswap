import { useSetAtom } from "jotai";
import { useMemo, useState } from "react";
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
  queryNetworkFee,
  SwapQueries,
} from "../utils";

import {
  useDebounce,
  useBalances,
  useContract,
  useSlippage,
  ZERO,
  MainLayout,
  isSwayInfinity,
} from "~/systems/Core";
import { useTransactionCost } from "~/systems/Core/hooks/useTransactionCost";
import { txFeedback } from "~/systems/Core/utils/feedback";
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
      SwapQueries.SwapPreview,
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

  const txCost = useTransactionCost(
    [SwapQueries.NetworkFee, swapState?.direction],
    () => queryNetworkFee(contract, swapState?.direction)
  );

  const validationState = getValidationState({
    swapState,
    previewAmount,
    hasLiquidity,
    balances: balances.data,
    slippage: slippage.value,
    txCost,
  });

  const shouldDisableSwap = !!(
    isLoading ||
    validationState !== ValidationStateEnum.Swap ||
    !txCost.total ||
    txCost.error
  );

  const btnText = getValidationText(validationState, swapState);

  const { mutate: swap, isLoading: isSwapping } = useMutation(
    async () => {
      if (!swapState) return;
      setHasSwapped(false);
      const res = await swapTokens(contract, swapState, txCost);
      return res;
    },
    { onSuccess: txFeedback("Swap made successfully!", handleSuccess) }
  );

  function handleSwap(state: SwapState) {
    setSwapState(state);
  }

  async function handleSuccess() {
    setHasSwapped(true);
    await balances.refetch();
  }

  return (
    <MainLayout>
      <Card>
        <Card.Title>
          <MdSwapCalls className="text-primary-500" />
          Swap
        </Card.Title>
        <SwapComponent
          networkFee={txCost?.fee}
          previewAmount={previewAmount}
          onChange={handleSwap}
          isLoading={isLoading}
        />
        <SwapPreview
          networkFee={txCost?.fee}
          isLoading={isLoading}
          swapInfo={swapInfo}
        />
        <PricePerToken
          swapState={swapState}
          previewAmount={previewAmount}
          isLoading={isLoading}
        />
        <Button
          isFull
          isLoading={isSwapping}
          size="lg"
          variant="primary"
          isDisabled={shouldDisableSwap}
          onPress={() => swap()}
          aria-label="Swap button"
        >
          {btnText}
        </Button>
      </Card>
    </MainLayout>
  );
}
