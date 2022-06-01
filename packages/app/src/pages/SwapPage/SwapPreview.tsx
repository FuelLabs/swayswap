import { BsArrowDown } from "react-icons/bs";

import { calculatePriceImpact, calculatePriceWithSlippage } from "./helpers";
import { useValueIsTyping } from "./jotai";
import type { SwapInfo } from "./types";
import { ActiveInput } from "./types";

import { PreviewItem, PreviewTable } from "~/components/PreviewTable";
import { NETWORK_FEE } from "~/config";
import { useSlippage } from "~/hooks/useSlippage";
import { ZERO, parseToFormattedNumber } from "~/lib/math";

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
  const outputAmount = parseToFormattedNumber(
    direction === ActiveInput.from ? previewAmount : amount || ZERO
  );
  const inputAmountWithSlippage = parseToFormattedNumber(
    calculatePriceWithSlippage(previewAmount, slippage.value, direction)
  );
  const networkFee = parseToFormattedNumber(NETWORK_FEE);

  return (
    <div>
      <div className="flex justify-center">
        <BsArrowDown size={20} className="text-gray-400" />
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
              ? "Min. received after slippage"
              : "Max. sent after slippage"
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
