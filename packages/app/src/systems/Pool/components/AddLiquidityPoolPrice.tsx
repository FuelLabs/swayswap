import { useSelector } from "@xstate/react";
import Decimal from "decimal.js";
import { bn, format } from "fuels";
import { useMemo } from "react";

import { useAddLiquidityContext } from "../hooks";
import { selectors } from "../selectors";

import { ONE_ASSET } from "~/systems/Core";

export const AddLiquidityPoolPrice = () => {
  const { service } = useAddLiquidityContext();
  const coinFrom = useSelector(service, selectors.coinFrom);
  const coinTo = useSelector(service, selectors.coinTo);
  const poolRatio = useSelector(service, selectors.poolRatio) || 1;

  const [daiPrice, ethPrice] = useMemo(() => {
    const daiPriceFormatted = format(
      bn(new Decimal(ONE_ASSET.toHex()).div(poolRatio).round().toHex())
    );
    const ethPriceFormatted = format(
      bn(new Decimal(ONE_ASSET.toHex()).mul(poolRatio).round().toHex())
    );
    return [daiPriceFormatted, ethPriceFormatted];
  }, [poolRatio]);

  return (
    <div aria-label="Pool Price Box">
      <h4 className="ml-2 mb-2 text-gray-200 text-sm">Pool price</h4>
      <div className="mb-4 text-sm border border-dashed border-gray-500 py-3 px-4 rounded-xl">
        <div className="flex flex-col font-mono text-gray-300">
          <span>
            1 {coinFrom.name} = {daiPrice} {coinTo.name}
          </span>
          <span>
            1 {coinTo.name} = {ethPrice} {coinFrom.name}
          </span>
        </div>
      </div>
    </div>
  );
};
