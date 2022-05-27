import { DECIMAL_UNITS, ONE_ASSET } from "~/config";
import { toNumber, parseToFormattedNumber } from "~/lib/math";
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
  // If reservers ratio is 0 then user
  // is creating pool and the ratio is 1:1
  const reservesRatio = reservesFromToRatio || 0.5;
  const daiPrice = parseToFormattedNumber(
    Math.floor(oneAssetAmount / reservesRatio),
    DECIMAL_UNITS
  );
  const ethPrice = parseToFormattedNumber(
    Math.floor(oneAssetAmount * 1 * reservesRatio),
    DECIMAL_UNITS
  );

  return (
    <div className="font-mono my-4 px-4 py-3 text-sm text-slate-400">
      <div className="flex">
        <h4 className="text-white mb-2 font-bold flex-1">
          {!reservesFromToRatio ? "Pool price" : "Creating pool price"}
        </h4>
        <div className="flex flex-col">
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
