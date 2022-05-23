import { formatUnits } from "ethers/lib/utils";
import { toBigInt, toNumber } from "fuels";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsArrowDown } from "react-icons/bs";
import { MdSwapCalls } from "react-icons/md";
import { useMutation, useQuery } from "react-query";

import { PricePerToken } from "./PricePerToken";
import { SwapComponent } from "./SwapComponent";
import { queryPreviewAmount, swapTokens } from "./queries";
import type { SwapState } from "./types";
import { ActiveInput } from "./types";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { PreviewItem, PreviewTable } from "~/components/PreviewTable";
import { DECIMAL_UNITS } from "~/config";
import { useContract } from "~/context/AppContext";
import useDebounce from "~/hooks/useDebounce";
import { usePoolInfo } from "~/hooks/usePoolInfo";
import { CoinETH } from "~/lib/constants";
import { isSwayInfinity, sleep } from "~/lib/utils";
import type { PoolInfo } from "~/types/contracts/ExchangeContractAbi";

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

// const SLIPPAGE_FEE = 0.3;
// Maximum sent after slippage (0.50%)
// Minimum received after slippage (0.50%)

function getPriceImpact(
  outputAmount: bigint,
  inputAmount: bigint,
  reserveInput: bigint,
  reserveOutput: bigint
) {
  const exchangeRateAfter = toNumber(inputAmount) / toNumber(outputAmount);
  const exchangeRateBefore = toNumber(reserveInput) / toNumber(reserveOutput);
  return ((exchangeRateAfter / exchangeRateBefore - 1) * 100).toFixed(2);
}

const calculatePriceImpact = (
  swapState: SwapState,
  previewAmount: bigint,
  poolInfo: PoolInfo
) => {
  if (swapState.direction === ActiveInput.from) {
    if (swapState.from !== CoinETH) {
      return getPriceImpact(
        previewAmount,
        swapState.amount || toBigInt(0),
        poolInfo.token_reserve,
        poolInfo.eth_reserve
      );
    }
    return getPriceImpact(
      previewAmount,
      swapState.amount || toBigInt(0),
      poolInfo.eth_reserve,
      poolInfo.token_reserve
    );
  }
  if (swapState.from !== CoinETH) {
    return getPriceImpact(
      swapState.amount || toBigInt(0),
      previewAmount,
      poolInfo.token_reserve,
      poolInfo.eth_reserve
    );
  }
  return getPriceImpact(
    swapState.amount || toBigInt(0),
    previewAmount,
    poolInfo.eth_reserve,
    poolInfo.token_reserve
  );
};

export default function SwapPage() {
  const contract = useContract()!;
  const [previewAmount, setPreviewAmount] = useState<bigint | null>(null);
  const [swapState, setSwapState] = useState<SwapState | null>(null);
  const [hasLiquidity, setHasLiquidity] = useState(true);
  const debouncedState = useDebounce(swapState);
  const { data: poolInfo } = usePoolInfo(contract);

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
      {swapState?.amount != null && previewAmount != null && poolInfo && (
        <div>
          <div className="flex justify-center">
            <BsArrowDown size={24} />
          </div>
          <PreviewTable title="Expected out:" className="my-2">
            <PreviewItem
              title={"Tokens you'll receive:"}
              value={`${formatUnits(
                swapState.direction === ActiveInput.from
                  ? previewAmount
                  : swapState.amount || toBigInt(0),
                DECIMAL_UNITS
              )} ${swapState?.coinTo.symbol}`}
            />
            <PreviewItem
              title={"Price impact: "}
              value={`${calculatePriceImpact(
                swapState,
                previewAmount,
                poolInfo
              )}%`}
            />
            <PreviewItem
              title={`${
                swapState.direction === ActiveInput.from
                  ? "Minimum received after slippage"
                  : "Maximum sent after slippage"
              }:`}
              value={`${formatUnits(
                swapState.direction === ActiveInput.from
                  ? previewAmount
                  : previewAmount,
                DECIMAL_UNITS
              )} ${
                swapState.direction === ActiveInput.from
                  ? swapState?.coinTo.symbol
                  : swapState?.coinFrom.symbol
              }`}
            />
          </PreviewTable>
        </div>
      )}
      <PricePerToken
        fromCoin={swapState?.coinFrom.symbol}
        fromAmount={swapState?.amount}
        toCoin={swapState?.coinTo.symbol}
        toAmount={previewAmount}
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
