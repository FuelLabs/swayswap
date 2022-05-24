import { formatUnits } from "ethers/lib/utils";
import { useAtomValue } from "jotai";
import { BsArrowDown } from "react-icons/bs";

import { calculatePriceImpact } from "./helpers";
import { swapIsTypingAtom } from "./jotai";
import type { SwapInfo } from "./types";
import { ActiveInput } from "./types";

import { PreviewItem, PreviewTable } from "~/components/PreviewTable";
import { DECIMAL_UNITS, NETWORK_FEE } from "~/config";
import { ZERO } from "~/lib/constants";

type SwapPreviewProps = {
  swapInfo: SwapInfo;
  isLoading: boolean;
};

export function SwapPreview({ swapInfo, isLoading }: SwapPreviewProps) {
  const { amount, previewAmount, direction, coinFrom, coinTo } = swapInfo;
  const isTyping = useAtomValue(swapIsTypingAtom);

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
          }:`}
          value={`${formatUnits(previewAmount, DECIMAL_UNITS)} ${
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
