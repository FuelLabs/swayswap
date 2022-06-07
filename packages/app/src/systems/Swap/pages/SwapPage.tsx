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
} from "../utils";

import {
  useDebounce,
  refreshBalances,
  useBalances,
  useContract,
  useSlippage,
  ZERO,
  isSwayInfinity,
  sleep,
} from "~/systems/Core";
import { usePoolInfo } from "~/systems/Pool";
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
  const { data: balances } = useBalances();
  const setHasSwapped = useSetAtom(swapHasSwappedAtom);

  const { isLoading } = useQuery(
    [
      "SwapPage-inactiveAmount",
      debouncedState?.amount?.toString(),
      debouncedState?.direction,
      debouncedState?.coinFrom.assetId,
      debouncedState?.coinTo.assetId,
    ],
    async () => {
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

  const { isLoading: feeIsLoading, data: networkFee } = useQuery(
    [],
    async () => {
      try {
        return await queryNetworkFee(contract, swapState?.direction);
      } catch (err) {
        return null;
      }
    },
    { enabled: true }
  );

  const { mutate: swap, isLoading: isSwapping } = useMutation(
    async () => {
      if (!swapState) return;
      if (!networkFee) return;
      await swapTokens(contract, swapState, networkFee);
      await sleep(1000);
    },
    {
      onSuccess: () => {
        setHasSwapped(true);
        toast.success("Swap made successfully!");
        refreshBalances();
      },
    }
  );

  function handleSwap(state: SwapState) {
    setSwapState(state);
  }

  const validationState = getValidationState({
    networkFee,
    swapState,
    balances,
    slippage: slippage.value,
    previewAmount,
    hasLiquidity,
  });

  const shouldDisableSwap =
    isLoading || validationState !== ValidationStateEnum.Swap;

  return (
    <Card className="sm:min-w-[450px]">
      <Card.Title>
        <MdSwapCalls className="text-primary-500" />
        Swap
      </Card.Title>
      <SwapComponent
        networkFee={networkFee}
        previewAmount={previewAmount}
        onChange={handleSwap}
        isLoading={isLoading}
      />
      <SwapPreview
        networkFee={networkFee}
        isLoading={isLoading}
        swapInfo={swapInfo}
      />
      <PricePerToken
        swapState={swapState}
        previewAmount={previewAmount}
        isLoading={feeIsLoading || isLoading}
      />
      <Button
        isFull
        isLoading={feeIsLoading || isSwapping}
        size="lg"
        variant="primary"
        isDisabled={shouldDisableSwap}
        onPress={() => swap()}
      >
        {getValidationText(validationState, swapState)}
      </Button>
    </Card>
  );
}
