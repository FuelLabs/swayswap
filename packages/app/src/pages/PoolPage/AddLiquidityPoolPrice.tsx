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
  <div className="font-mono my-4 px-4 py-3 text-sm text-slate-400">
    <div className="flex">
      <h4 className="text-white mb-2 font-bold flex-1">Pool price</h4>
      <div className="flex flex-col">
        <span>
          1 {coinFrom.name} ={" "}
          {parseToFormattedNumber(
            Math.floor((toNumber(ONE_ASSET) * 1) / reservesFromToRatio)
          )}{" "}
          {coinTo.name}
        </span>
        <span>
          1 {coinTo.name} ={" "}
          {parseToFormattedNumber(
            Math.floor(toNumber(ONE_ASSET) * 1 * reservesFromToRatio)
          )}{" "}
          {coinFrom.name}
        </span>
      </div>
    </div>
  </div>
);
