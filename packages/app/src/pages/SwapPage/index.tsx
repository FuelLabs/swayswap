import type { CoinQuantity } from "fuels";
import { toNumber } from "fuels";
import { useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdSwapCalls } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

import { PricePerToken } from "./PricePerToken";
import { SwapComponent } from "./SwapComponent";
import { SwapPreview } from "./SwapPreview";
import { calculatePriceWithSlippage } from "./helpers";
import { swapHasSwappedAtom } from "./jotai";
import { queryPreviewAmount, swapTokens } from "./queries";
import type { SwapInfo, SwapState } from "./types";
import { ActiveInput, ValidationStateEnum } from "./types";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { useBalances } from "~/hooks/useBalances";
import { useContract } from "~/hooks/useContract";
import useDebounce from "~/hooks/useDebounce";
import { usePoolInfo } from "~/hooks/usePoolInfo";
import { useSlippage } from "~/hooks/useSlippage";
import { ZERO } from "~/lib/constants";
import { queryClient } from "~/lib/queryClient";
import { isSwayInfinity, sleep } from "~/lib/utils";
import type { PreviewInfo } from "~/types/contracts/Exchange_contractAbi";

type StateParams = {
  swapState: SwapState | null;
  previewAmount: bigint | null;
  hasLiquidity: boolean;
  slippage: number;
  balances?: CoinQuantity[];
};

const getValidationText = (
  state: ValidationStateEnum,
  swapState: SwapState | null
) => {
  switch (state) {
    case ValidationStateEnum.SelectToken:
      return "Select token";
    case ValidationStateEnum.EnterAmount:
      return "Enter amount";
    case ValidationStateEnum.InsufficientBalance:
      return `Insufficient ${swapState?.coinFrom.symbol || ""} balance`;
    case ValidationStateEnum.InsufficientAmount:
      return `Insufficient amount to swap`;
    case ValidationStateEnum.InsufficientLiquidity:
      return "Insufficient liquidity";
    default:
      return "Swap";
  }
};

const hasBalanceWithSlippage = ({
  swapState,
  previewAmount,
  slippage,
  balances,
}: StateParams) => {
  if (swapState!.direction === ActiveInput.to) {
    const amountWithSlippage = calculatePriceWithSlippage(
      previewAmount || ZERO,
      slippage,
      swapState!.direction
    );
    const currentBalance = toNumber(
      balances?.find((coin) => coin.assetId === swapState!.coinFrom.assetId)
        ?.amount || ZERO
    );
    return amountWithSlippage > currentBalance;
  }
  return false;
};

const getValidationState = (stateParams: StateParams): ValidationStateEnum => {
  const { swapState, previewAmount, hasLiquidity } = stateParams;
  if (!swapState?.coinFrom || !swapState?.coinTo) {
    return ValidationStateEnum.SelectToken;
  }
  if (!swapState?.amount) {
    return ValidationStateEnum.EnterAmount;
  }
  if (!swapState.hasBalance || hasBalanceWithSlippage(stateParams)) {
    return ValidationStateEnum.InsufficientBalance;
  }
  if (!hasLiquidity || isSwayInfinity(previewAmount))
    return ValidationStateEnum.InsufficientLiquidity;
  return ValidationStateEnum.Swap;
};

export default function SwapPage() {
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
      return queryPreviewAmount(contract, debouncedState);
    },
    {
      onSuccess: (preview) => {
        if (preview == null) return;
        if (isSwayInfinity(preview.amount)) {
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
      await swapTokens(contract, swapState);
      await sleep(1000);
    },
    {
      onSuccess: () => {
        setHasSwapped(true);
        toast.success("Swap made successfully!");
        queryClient.refetchQueries(["AssetsPage-balances"]);
      },
    }
  );

  function handleSwap(state: SwapState) {
    setSwapState(state);
  }

  const validationState = getValidationState({
    swapState,
    balances,
    slippage: slippage.value,
    previewAmount,
    hasLiquidity,
  });

  const shouldDisableSwap =
    isLoading || validationState !== ValidationStateEnum.Swap;

  return (
    <Card className="self-start min-w-[450px] mt-24">
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
        isFull
        isLoading={isSwaping}
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
