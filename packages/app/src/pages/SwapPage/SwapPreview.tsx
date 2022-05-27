import { BsArrowDown } from "react-icons/bs";

import { calculatePriceImpact, calculatePriceWithSlippage } from "./helpers";
import { useValueIsTyping } from "./jotai";
import type { SwapInfo } from "./types";
import { ActiveInput } from "./types";

import { PreviewItem, PreviewTable } from "~/components/PreviewTable";
import { DECIMAL_UNITS, NETWORK_FEE } from "~/config";
import { useSlippage } from "~/hooks/useSlippage";
import { ZERO, formatUnits, toFixed } from "~/lib/math";

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
  const outputAmount = toFixed(
    formatUnits(
      direction === ActiveInput.from ? previewAmount : amount || ZERO,
      DECIMAL_UNITS
    )
  );
  const inputAmountWithSlippage = toFixed(
    formatUnits(
      calculatePriceWithSlippage(previewAmount, slippage.value, direction),
      DECIMAL_UNITS
    )
  );
  const networkFee = toFixed(formatUnits(NETWORK_FEE, DECIMAL_UNITS));

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
          value={`${inputAmountWithSlippage} ${
            direction === ActiveInput.from ? coinTo.symbol : coinFrom.symbol
          }`}
        />
        <PreviewItem
          className="text-gray-300"
          title={`Network Fee`}
          value={`${networkFee} ETH`}
        />
      </PreviewTable>
    </div>
  );
}
