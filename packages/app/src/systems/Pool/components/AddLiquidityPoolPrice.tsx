import Decimal from "decimal.js";
import { bn } from "fuels";

import { useUserPositions } from "../hooks";

import { format, ONE_ASSET } from "~/systems/Core";
import type { Coin } from "~/types";

export interface AddLiquidityPoolPriceProps {
  coinFrom: Coin;
  coinTo: Coin;
}

export const AddLiquidityPoolPrice = ({
  coinFrom,
  coinTo,
}: AddLiquidityPoolPriceProps) => {
  const { poolRatio } = useUserPositions();
  const daiPrice = format(
    bn(new Decimal(ONE_ASSET.toHex()).div(poolRatio).round().toHex())
  );
  const ethPrice = format(
    bn(new Decimal(ONE_ASSET.toHex()).mul(poolRatio).round().toHex())
  );
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
