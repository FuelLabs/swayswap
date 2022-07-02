import { parseToFormattedNumber } from "../utils";

import { PreviewItem } from "./PreviewTable";

import type { Maybe } from "~/types";

export function NetworkFeePreviewItem({
  networkFee,
  loading,
}: {
  networkFee?: Maybe<bigint>;
  loading?: boolean;
}) {
  if (!networkFee) return null;

  return (
    <PreviewItem
      className="text-gray-300"
      title={`Network Fee`}
      value={`~ ${parseToFormattedNumber(networkFee)} ETH`}
      loading={loading}
    />
  );
}
