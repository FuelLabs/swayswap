import { BsArrowDown } from "react-icons/bs";

import { useValueIsTyping } from "../state";
import type { SwapInfo } from "../types";
import { ActiveInput } from "../types";
import { calculatePriceWithSlippage, calculatePriceImpact } from "../utils";

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
  networkFee?: bigint | null;
};

export function SwapPreview({
  swapInfo,
  networkFee,
  isLoading,
}: SwapPreviewProps) {
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
        {networkFee ? (
          <PreviewItem
            className="text-gray-300"
            title={`Network Fee`}
            value={`~ ${parseToFormattedNumber(networkFee)} ETH`}
          />
        ) : null}
      </PreviewTable>
    </div>
  );
}
