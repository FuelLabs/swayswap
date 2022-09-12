import type { BN } from "fuels";
import { BsArrowDown } from "react-icons/bs";

import { usePreviewAddLiquidity } from "../hooks";

import type { UseCoinInput } from "~/systems/Core";
import {
  format,
  PreviewItem,
  PreviewTable,
  TokenIcon,
  useCoinMetadata,
  ETH_DAI,
} from "~/systems/Core";
import type { Maybe } from "~/types";
import type { PoolInfoOutput } from "~/types/contracts/ExchangeContractAbi";

export interface AddLiquidityPreviewProps {
  poolInfo?: PoolInfoOutput;
  fromInput: UseCoinInput;
  networkFee?: Maybe<BN>;
}

export const AddLiquidityPreview = ({
  poolInfo,
  fromInput,
  networkFee,
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
        aria-label="Preview Add Liquidity Output"
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
        {networkFee ? (
          <PreviewItem
            className="text-gray-300"
            title={`Network Fee`}
            value={`~ ${format(networkFee)} ETH`}
          />
        ) : null}
      </PreviewTable>
    </>
  );
};
