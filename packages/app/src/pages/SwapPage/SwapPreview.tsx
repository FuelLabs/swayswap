import { BsArrowDown } from "react-icons/bs";

import { calculatePriceImpact, calculatePriceWithSlippage } from "./helpers";
import { useValueIsTyping } from "./jotai";
import type { SwapInfo } from "./types";
import { ActiveInput } from "./types";

import { PreviewItem, PreviewTable } from "~/components/PreviewTable";
import { DECIMAL_UNITS, NETWORK_FEE } from "~/config";
import { useSlippage } from "~/hooks/useSlippage";
import { ZERO } from "~/lib/constants";
import { formatUnits } from "~/lib/math";

type SwapPreviewProps = {
  swapInfo: SwapInfo;
  isLoading: boolean;
};

export function SwapPreview({ swapInfo, isLoading }: SwapPreviewProps) {
  const { amount, previewAmount, direction, coinFrom, coinTo } = swapInfo;
  const isTyping = useValueIsTyping();
  const slippage = useSlippage();

  if (
    !coinFrom ||
    !coinTo ||
    !previewAmount ||
    !direction ||
    !amount ||
    isLoading ||
    isTyping
  ) {
    return null;
  }
  // Expected amount of tokens to be received
  const outputAmount = formatUnits(
    direction === ActiveInput.from ? previewAmount : amount || ZERO,
    DECIMAL_UNITS
  );

  return (
    <div>
      <div className="flex justify-center">
        <BsArrowDown size={24} />
      </div>
      <PreviewTable title="Expected out:" className="my-2">
        <PreviewItem
          title={"You'll receive:"}
          value={`${outputAmount} ${coinTo.symbol}`}
        />
        <PreviewItem
          title={"Price impact: "}
          value={`${calculatePriceImpact(swapInfo)}%`}
        />
        <PreviewItem
          title={`${
            direction === ActiveInput.from
              ? "Minimum received after slippage"
              : "Maximum sent after slippage"
          } (${slippage.formatted}):`}
          value={`${formatUnits(
            calculatePriceWithSlippage(
              previewAmount,
              slippage.value,
              direction
            ),
            DECIMAL_UNITS
          )} ${
            direction === ActiveInput.from ? coinTo.symbol : coinFrom.symbol
          }`}
        />
        <PreviewItem
          className="text-gray-300"
          title={`Network Fee`}
          value={`${formatUnits(NETWORK_FEE, DECIMAL_UNITS)} ETH`}
        />
      </PreviewTable>
    </div>
  );
}
