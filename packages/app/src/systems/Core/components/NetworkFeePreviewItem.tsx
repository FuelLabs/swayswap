import { parseToFormattedNumber } from "../utils";

import { PreviewItem } from "./PreviewTable";

export function NetworkFeePreviewItem({
  networkFee,
}: {
  networkFee?: bigint | null;
}) {
  if (!networkFee) return null;

  return (
    <PreviewItem
      className="text-gray-300"
      title={`Network Fee`}
      value={`~ ${parseToFormattedNumber(networkFee)} ETH`}
    />
  );
}
