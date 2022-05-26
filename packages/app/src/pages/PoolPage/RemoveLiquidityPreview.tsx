import { BsArrowDown } from "react-icons/bs";

import { usePreviewRemoveLiquidity } from "./usePreviewRemoveLiquidity";

import { PreviewItem, PreviewTable } from "~/components/PreviewTable";

export interface RemoveLiquidityPreviewProps {
  amount: bigint | null;
}

export const RemoveLiquidityPreview = ({
  amount,
}: RemoveLiquidityPreviewProps) => {
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
      <PreviewTable title="Expected output:" className="my-2 mb-4">
        <PreviewItem title="DAI:" value={formattedPreviewDAIRemoved} />
        <PreviewItem title={"ETH:"} value={formattedPreviewETHRemoved} />
        <PreviewItem
          title="Pool tokens after:"
          value={`${formattedNextCurrentPoolTokens}`}
        />
        <PreviewItem
          title="Pool share after:"
          value={`${formattedNextPoolShare}%`}
        />
      </PreviewTable>
    </>
  );
};
