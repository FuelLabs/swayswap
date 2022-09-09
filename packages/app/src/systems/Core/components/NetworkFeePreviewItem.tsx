import type { BN } from "fuels";

import { parseToFormattedNumber } from "../utils";

import { PreviewItem } from "./PreviewTable";

import type { Maybe } from "~/types";

export function NetworkFeePreviewItem({
  networkFee,
  loading,
}: {
  networkFee?: Maybe<BN>;
  loading?: boolean;
}) {
  if (!networkFee || networkFee.lte(0)) return null;

  return (
    <PreviewItem
      className="text-gray-300"
      title={`Network Fee`}
      value={`~ ${parseToFormattedNumber(networkFee)} ETH`}
      loading={loading}
    />
  );
}
