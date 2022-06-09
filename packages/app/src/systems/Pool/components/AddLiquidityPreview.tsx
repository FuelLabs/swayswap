import { BsArrowDown } from "react-icons/bs";

import { usePreviewAddLiquidity } from "../hooks";

import type { UseCoinInput } from "~/systems/Core";
import {
  PreviewItem,
  PreviewTable,
  TokenIcon,
  useCoinMetadata,
  ETH_DAI,
} from "~/systems/Core";
import type { PoolInfo } from "~/types/contracts/ExchangeContractAbi";

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
      <PreviewTable
        title="Expected output:"
        className="mt-2 mb-4"
        aria-label="preview-add-liquidity-output"
      >
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
