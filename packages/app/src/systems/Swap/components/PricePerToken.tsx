import { AiOutlineSwap } from "react-icons/ai";

import { usePricePerToken } from "../hooks/usePricePerToken";

import { Button } from "~/systems/UI";

const style = {
  wrapper: `flex items-center gap-3 my-4 px-2 text-sm text-gray-400`,
  priceContainer: `min-w-[150px] cursor-pointer`,
};

export function PricePerToken() {
  const data = usePricePerToken();

  return (
    <div
      onClick={data.onToggleAssets}
      className={style.wrapper}
      aria-label="Price per token"
    >
      <div className={style.priceContainer}>
        <span className="text-gray-200">1</span> {data.assetFrom.symbol} ={" "}
        <span className="text-gray-200">{data.pricePerToken}</span>{" "}
        {data.assetTo.symbol}
      </div>
      <Button
        size="sm"
        className="h-auto p-0 border-none"
        onPress={data.onToggleAssets}
        aria-label="Invert token price"
      >
        <AiOutlineSwap size={20} />
      </Button>
    </div>
  );
}
