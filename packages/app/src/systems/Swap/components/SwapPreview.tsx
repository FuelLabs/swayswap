import { BsArrowDown } from "react-icons/bs";

import { useValueIsTyping } from "../state";
import type { SwapInfo } from "../types";
import { SwapDirection } from "../types";
import { calculatePriceWithSlippage, calculatePriceImpact } from "../utils";

import {
  PreviewItem,
  PreviewTable,
  useSlippage,
  ZERO,
  parseToFormattedNumber,
  NetworkFeePreviewItem,
} from "~/systems/Core";
import type { Maybe } from "~/types";

type SwapPreviewProps = {
  swapInfo: SwapInfo;
  isLoading: boolean;
  networkFee?: Maybe<bigint>;
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
  const nextAmount =
    direction === SwapDirection.fromTo ? previewAmount : amount || ZERO;

  const outputAmount = parseToFormattedNumber(nextAmount);
  const priceWithSlippage = calculatePriceWithSlippage(
    previewAmount,
    slippage.value,
    direction
  );
  const inputAmountWithSlippage = parseToFormattedNumber(priceWithSlippage);

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
            direction === SwapDirection.fromTo
              ? "Min. received after slippage"
              : "Max. sent after slippage"
          } (${slippage.formatted}):`}
          value={`${inputAmountWithSlippage} ${
            direction === SwapDirection.fromTo ? coinTo.symbol : coinFrom.symbol
          }`}
        />
        <NetworkFeePreviewItem networkFee={networkFee} />
      </PreviewTable>
    </div>
  );
}
