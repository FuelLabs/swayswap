import { toNumber } from "fuels";

import { ONE_ASSET } from "~/config";
import { parseToFormattedNumber } from "~/lib/utils";
import type { Coin } from "~/types";

export interface AddLiquidityPoolPriceProps {
  coinFrom: Coin;
  coinTo: Coin;
  reservesFromToRatio: number;
}

export const AddLiquidityPoolPrice = ({
  coinFrom,
  coinTo,
  reservesFromToRatio,
}: AddLiquidityPoolPriceProps) => (
  <div>
    <h4 className="ml-2 mb-2 text-gray-200 text-sm">Pool price</h4>
    <div className="mb-4 text-sm border border-dashed border-gray-500 py-3 px-4 rounded-lg">
      <div className="flex flex-col font-mono text-gray-300">
        <span>
          1 {coinFrom.name} →{" "}
          {parseToFormattedNumber(
            Math.floor((toNumber(ONE_ASSET) * 1) / reservesFromToRatio)
          )}{" "}
          {coinTo.name}
        </span>
        <span>
          1 {coinTo.name} →{" "}
          {parseToFormattedNumber(
            Math.floor(toNumber(ONE_ASSET) * 1 * reservesFromToRatio)
          )}{" "}
          {coinFrom.name}
        </span>
      </div>
    </div>
  </div>
);
