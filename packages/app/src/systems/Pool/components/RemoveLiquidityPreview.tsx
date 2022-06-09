import { BsArrowDown } from "react-icons/bs";

import { usePreviewRemoveLiquidity } from "../hooks";

import {
  PreviewItem,
  PreviewTable,
  TokenIcon,
  useCoinMetadata,
  ETH_DAI,
} from "~/systems/Core";

export interface RemoveLiquidityPreviewProps {
  amount: bigint | null;
}

export const RemoveLiquidityPreview = ({
  amount,
}: RemoveLiquidityPreviewProps) => {
  const { coinMetaData } = useCoinMetadata({ symbol: ETH_DAI.name });
  const coinFrom = coinMetaData?.pairOf?.[0];
  const coinTo = coinMetaData?.pairOf?.[1];
  const {
    formattedPreviewDAIRemoved,
    formattedPreviewETHRemoved,
    formattedNextCurrentPoolTokens,
    formattedNextPoolShare,
  } = usePreviewRemoveLiquidity({ amountToRemove: amount });

  if (!amount) return null;

  return (
    <>
      <div className="flex justify-center">
        <BsArrowDown size={24} />
      </div>
      <PreviewTable
        title="Expected output:"
        className="my-2 mb-4"
        aria-label="preview-remove-liquidity-output"
      >
        <PreviewItem
          title="DAI:"
          value={
            <div className="flex flex-1 items-center justify-end">
              {formattedPreviewDAIRemoved}{" "}
              <TokenIcon coinFrom={coinTo} size={14} />
            </div>
          }
        />
        <PreviewItem
          title={"ETH:"}
          value={
            <div className="flex flex-1 items-center justify-end">
              {formattedPreviewETHRemoved}{" "}
              <TokenIcon coinFrom={coinFrom} size={14} />
            </div>
          }
        />
        <PreviewItem
          title="Pool tokens after:"
          value={
            <div className="flex flex-1 items-center justify-end">
              {formattedNextCurrentPoolTokens}{" "}
              <TokenIcon coinFrom={coinFrom} coinTo={coinTo} size={14} />
            </div>
          }
        />
        <PreviewItem
          title="Pool share after:"
          value={`${formattedNextPoolShare}%`}
        />
      </PreviewTable>
    </>
  );
};
