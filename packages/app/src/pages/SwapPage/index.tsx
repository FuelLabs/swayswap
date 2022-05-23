import { useState } from "react";
import toast from "react-hot-toast";
import { MdSwapCalls } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

import { SwapComponent } from "./SwapComponent";
import { queryPreviewAmount, swapTokens } from "./queries";
import type { SwapState } from "./types";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { useContract } from "~/context/AppContext";
import useDebounce from "~/hooks/useDebounce";
import { isSwayInfinity, sleep } from "~/lib/utils";

type StateParams = {
  swapState: SwapState | null;
  previewAmount: bigint | null;
  hasLiquidity: boolean;
};

enum ValidationStateEnum {
  SelectToken = 0,
  EnterAmount = 1,
  InsufficientBalance = 2,
  InsufficientLiquidity = 3,
  Swap = 4,
}

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
      return `Insufficient ${swapState?.coin.symbol || ""} balance`;
    case ValidationStateEnum.InsufficientLiquidity:
      return "Insufficient liquidity";
    default:
      return "Swap";
  }
};

const getValidationState = ({
  swapState,
  previewAmount,
  hasLiquidity,
}: StateParams): ValidationStateEnum => {
  if (!swapState?.to || !swapState?.from) {
    return ValidationStateEnum.SelectToken;
  }
  if (!swapState?.amount) {
    return ValidationStateEnum.EnterAmount;
  }
  if (!swapState.hasBalance) {
    return ValidationStateEnum.InsufficientBalance;
  }
  if (!hasLiquidity || isSwayInfinity(previewAmount))
    return ValidationStateEnum.InsufficientLiquidity;
  return ValidationStateEnum.Swap;
};

export default function SwapPage() {
  const contract = useContract()!;
  const [previewAmount, setPreviewAmount] = useState<bigint | null>(null);
  const [swapState, setSwapState] = useState<SwapState | null>(null);
  const [hasLiquidity, setHasLiquidity] = useState(true);
  const debouncedState = useDebounce(swapState);

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
  });

  const shouldDisableSwap =
    isLoading || validationState !== ValidationStateEnum.Swap;

  return (
    <Card className="min-w-[450px]">
      <Card.Title>
        <MdSwapCalls className="text-primary-500" />
        Swap
      </Card.Title>
      <SwapComponent
        previewAmount={previewAmount}
        onChange={handleSwap}
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
