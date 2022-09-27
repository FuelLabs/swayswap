import { useSelector } from "@xstate/react";
import { bn, format, toFixed } from "fuels";
import { BsArrowDown } from "react-icons/bs";

import { useAddLiquidityContext } from "../hooks";
import { selectors } from "../selectors";

import {
  PreviewItem,
  PreviewTable,
  TokenIcon,
  compareStates,
} from "~/systems/Core";

export const AddLiquidityPreview = () => {
  const { service } = useAddLiquidityContext();
  const coinFrom = useSelector(service, selectors.coinFrom);
  const coinTo = useSelector(service, selectors.coinTo);
  const poolShare = useSelector(service, selectors.poolShare, compareStates);
  const transactionCost = useSelector(
    service,
    selectors.transactionCost,
    compareStates
  );
  const previewAmount = useSelector(
    service,
    selectors.previewAmount,
    compareStates
  );
  const isLoading = useSelector(service, selectors.isLoading);

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
          loading={isLoading}
          value={
            <div className="flex flex-1 items-center justify-end">
              {format(previewAmount)}{" "}
              <TokenIcon coinFrom={coinFrom} coinTo={coinTo} size={14} />
            </div>
          }
        />
        <PreviewItem
          loading={isLoading}
          title={"Your share of current pool:"}
          value={`${toFixed(poolShare.toString())}%`}
        />
        {!bn(transactionCost?.fee).isZero() && transactionCost ? (
          <PreviewItem
            loading={isLoading}
            className="text-gray-300"
            title={`Network Fee`}
            value={`~ ${format(transactionCost.fee)} ETH`}
          />
        ) : null}
      </PreviewTable>
    </>
  );
};
