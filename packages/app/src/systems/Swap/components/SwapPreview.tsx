import { BsArrowDown } from "react-icons/bs";

import { useValueIsTyping } from "../state";
import type { SwapInfo } from "../types";
import { ActiveInput } from "../types";
import { calculatePriceWithSlippage, calculatePriceImpact } from "../utils";

import { NETWORK_FEE } from "~/config";
import {
  PreviewItem,
  PreviewTable,
  useSlippage,
  ZERO,
  parseToFormattedNumber,
} from "~/systems/Core";

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
  const nextAmount =
    direction === ActiveInput.from ? previewAmount : amount || ZERO;

  const outputAmount = parseToFormattedNumber(nextAmount);
  const priceWithSlippage = calculatePriceWithSlippage(
    previewAmount,
    slippage.value,
    direction
  );

  const inputAmountWithSlippage = parseToFormattedNumber(priceWithSlippage);
  const networkFee = parseToFormattedNumber(NETWORK_FEE);

  return (
    <div aria-label="preview-swap-output">
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
