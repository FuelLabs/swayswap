import { BsArrowDown } from "react-icons/bs";

import { usePreviewAddLiquidity } from "./usePreviewAddLiquidity";

import type { UseCoinInput } from "~/components/CoinInput";
import { PreviewItem, PreviewTable } from "~/components/PreviewTable";
import { TokenIcon } from "~/components/TokenIcon";
import { useCoinMetadata } from "~/hooks/useCoinMetadata";
import { ETH_DAI } from "~/lib/CoinsMetadata";
import type { PoolInfo } from "~/types/contracts/Exchange_contractAbi";

export interface AddLiquidityPreviewProps {
  poolInfo?: PoolInfo;
  fromInput: UseCoinInput;
}

export const AddLiquidityPreview = ({
  poolInfo,
  fromInput,
}: AddLiquidityPreviewProps) => {
  const { coinMetaData } = useCoinMetadata({ symbol: ETH_DAI.name });
  const coinFrom = coinMetaData?.pairOf?.[0];
  const coinTo = coinMetaData?.pairOf?.[1];

  const { formattedPreviewTokens, formattedNextCurrentPoolShare } =
    usePreviewAddLiquidity({
      fromInput,
      poolInfo,
    });

  return (
    <>
      <div className="flex justify-center">
        <BsArrowDown size={20} className="text-gray-400" />
      </div>
      <PreviewTable title="Expected output:" className="mt-2 mb-4">
        <PreviewItem
          title="Pool tokens you'll receive:"
          value={
            <div className="flex flex-1 items-center justify-end">
              {formattedPreviewTokens}{" "}
              <TokenIcon coinFrom={coinFrom} coinTo={coinTo} size={14} />
            </div>
          }
        />
        <PreviewItem
          title={"Your share of current pool:"}
          value={`${formattedNextCurrentPoolShare}%`}
        />
      </PreviewTable>
    </>
  );
};
