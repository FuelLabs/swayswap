import type { BN } from "fuels";
import { bn } from "fuels";
import { BsArrowDown } from "react-icons/bs";

import { usePreviewRemoveLiquidity } from "../hooks";

import {
  PreviewItem,
  PreviewTable,
  TokenIcon,
  useCoinMetadata,
  ETH_DAI,
  NetworkFeePreviewItem,
} from "~/systems/Core";
import type { Maybe } from "~/types";

export interface RemoveLiquidityPreviewProps {
  amount: Maybe<BN>;
  networkFee?: Maybe<BN>;
}

export const RemoveLiquidityPreview = ({
  amount,
  networkFee,
}: RemoveLiquidityPreviewProps) => {
  const { coinMetaData } = useCoinMetadata({ symbol: ETH_DAI.name });
  const coinFrom = coinMetaData?.pairOf?.[0];
  const coinTo = coinMetaData?.pairOf?.[1];
  const {
    formattedPooledDAI,
    formattedPooledETH,
    formattedNextPoolTokens,
    formattedNextPoolShare,
  } = usePreviewRemoveLiquidity(bn(amount));

  if (!amount) return null;

  return (
    <>
      <div className="flex justify-center">
        <BsArrowDown size={24} />
      </div>
      <PreviewTable
        title="Expected output:"
        className="my-2 mb-4"
        aria-label="Preview Remove Liquidity Output"
      >
        <PreviewItem
          title="DAI:"
          value={
            <div className="flex flex-1 items-center justify-end">
              {formattedPooledDAI} <TokenIcon coinFrom={coinTo} size={14} />
            </div>
          }
        />
        <PreviewItem
          title={"ETH:"}
          value={
            <div className="flex flex-1 items-center justify-end">
              {formattedPooledETH} <TokenIcon coinFrom={coinFrom} size={14} />
            </div>
          }
        />
        <PreviewItem
          title="Pool tokens after:"
          value={
            <div className="flex flex-1 items-center justify-end">
              {formattedNextPoolTokens}{" "}
              <TokenIcon coinFrom={coinFrom} coinTo={coinTo} size={14} />
            </div>
          }
        />
        <PreviewItem
          title="Pool share after:"
          value={`${formattedNextPoolShare}%`}
        />
        <NetworkFeePreviewItem networkFee={networkFee} />
      </PreviewTable>
    </>
  );
};
