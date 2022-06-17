import { BsArrowDown } from "react-icons/bs";

import { useSwap } from "../hooks/useSwap";
import { useSwapPreview } from "../hooks/useSwapPreview";
import { SwapDirection } from "../types";

import {
  PreviewItem,
  PreviewTable,
  NetworkFeePreviewItem,
} from "~/systems/Core";

export function SwapPreview() {
  const { state } = useSwap();
  const preview = useSwapPreview();

  const { slippage } = preview;
  const { coinTo, coinFrom, direction, txCost } = state;

  const isFrom = direction === SwapDirection.fromTo;
  const inputSymbol = isFrom ? coinTo?.symbol : coinFrom?.symbol;
  const inputText = isFrom
    ? "Min. received after slippage"
    : "Max. sent after slippage";

  return (
    <div aria-label="Preview Swap Output">
      <div className="flex justify-center">
        <BsArrowDown size={20} className="text-gray-400" />
      </div>
      <PreviewTable title="Expected out:" className="my-2">
        <PreviewItem
          title={"You'll receive:"}
          value={`${preview.outputAmount} ${coinTo?.symbol}`}
        />
        <PreviewItem
          title={"Price impact: "}
          value={`${preview.priceImpact}%`}
        />
        <PreviewItem
          title={`${inputText} (${slippage?.formatted}):`}
          value={`${preview.inputAmount} ${inputSymbol}`}
        />
        <NetworkFeePreviewItem networkFee={txCost?.total} />
      </PreviewTable>
    </div>
  );
}
