import { toNumber } from "fuels";

import { parseToFormattedNumber, ONE_ASSET } from "~/systems/Core";
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
}: AddLiquidityPoolPriceProps) => {
  const oneAssetAmount = toNumber(ONE_ASSET);
  const reservesRatio = reservesFromToRatio;
  const daiPrice = parseToFormattedNumber(
    Math.floor(oneAssetAmount / reservesRatio)
  );
  const ethPrice = parseToFormattedNumber(
    Math.floor(oneAssetAmount * 1 * reservesRatio)
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
