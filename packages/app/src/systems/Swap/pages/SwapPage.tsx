import type { TransactionResult } from "fuels";
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
  queryNetworkFee,
  SwapQueries,
} from "../utils";

import { BLOCK_EXPLORER_URL } from "~/config";
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
import { usePoolInfo, useUserPositions } from "~/systems/Pool";
import { Button, Card, Link } from "~/systems/UI";
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

  const shouldDisableSwap =
    isLoading || validationState !== ValidationStateEnum.Swap;

  const btnText = getValidationText(validationState, swapState);

  const { mutate: swap, isLoading: isSwapping } = useMutation(
    async () => {
      if (!swapState) return;
      if (!txCost?.gas || txCost.error) return;
      setHasSwapped(false);
      return swapTokens(contract, swapState, txCost);
    },
    {
      onSuccess: handleSuccess,
    }
  );

  function handleSwap(state: SwapState) {
    setSwapState(state);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSuccess(data: TransactionResult<any> | undefined) {
    const txLink = (
      <p className="text-xs text-gray-300 mt-1">
        <Link
          isExternal
          href={`${BLOCK_EXPLORER_URL}/transaction/${data?.blockId}`}
        >
          View it on Fuel Explorer
        </Link>
      </p>
    );

    /**
     * Show a toast success message if status.type === 'success'
     */
    if (data?.status.type === "success") {
      setHasSwapped(true);
      toast.success(<>Swap made successfully! {txLink}</>, {
        duration: 5000,
      });
      await balances.refetch();
      return;
    }

    /**
     * Show a toast error if status.type !== 'success''
     */
    toast.error(<>Transaction reverted! {txLink}</>);
  }

  return (
    <MainLayout>
      <Card className="sm:min-w-[450px]">
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
