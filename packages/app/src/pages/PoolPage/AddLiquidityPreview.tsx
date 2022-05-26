import { usePreviewAddLiquidity } from "./usePreviewAddLiquidity";

import type { UseCoinInput } from "~/components/CoinInput";
import { PreviewItem, PreviewTable } from "~/components/PreviewTable";
import type { PoolInfo } from "~/types/contracts/Exchange_contractAbi";

export interface AddLiquidityPreviewProps {
  poolInfo?: PoolInfo;
  fromInput: UseCoinInput;
}

export const AddLiquidityPreview = ({
  poolInfo,
  fromInput,
}: AddLiquidityPreviewProps) => {
  const { formattedPreviewTokens, formattedNextCurrentPoolShare } =
    usePreviewAddLiquidity({
      fromInput,
      poolInfo,
    });

  return (
    <PreviewTable title="Expected output:" className="my-2">
      <PreviewItem
        title="Pool tokens you'll receive:"
        value={formattedPreviewTokens}
      />
      <PreviewItem
        title={"Your share of current pool:"}
        value={`${formattedNextCurrentPoolShare}%`}
      />
    </PreviewTable>
  );
};
