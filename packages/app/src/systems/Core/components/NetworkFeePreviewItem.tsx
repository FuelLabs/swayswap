import { parseToFormattedNumber } from "../utils";

import { PreviewItem } from "./PreviewTable";

import type { Maybe } from "~/types";

export function NetworkFeePreviewItem({
  networkFee,
}: {
  networkFee?: Maybe<bigint>;
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
