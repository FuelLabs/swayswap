import { toNumber } from "fuels";
import { useEffect, useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";

import { useValueIsTyping } from "./jotai";
import type { SwapState } from "./types";
import { ActiveInput } from "./types";

import { Button } from "~/components/Button";
import { ONE_ASSET } from "~/config";
import { ZERO } from "~/lib/constants";
import { divideBigInt } from "~/lib/utils";

const style = {
  wrapper: `flex items-center gap-3 my-4 px-2 text-sm text-gray-400`,
};

function getPricePerToken(
  fromAmount?: bigint | null,
  toAmount?: bigint | null
) {
  if (!toAmount || !fromAmount) return "";
  const ratio = divideBigInt(toAmount, fromAmount);
  const price = ratio * toNumber(ONE_ASSET);
  return (price / toNumber(ONE_ASSET)).toFixed(6);
}

type PricePerTokenProps = {
  swapState?: SwapState | null;
  previewAmount?: bigint | null;
  isLoading?: boolean;
};

type Asset = {
  symbol: string;
  amount: bigint;
};

const createAsset = (
  symbol?: string | null,
  amount?: bigint | null
): Asset => ({
  symbol: symbol || "",
  amount: amount || ZERO,
});

export function PricePerToken({
  swapState,
  previewAmount,
  isLoading,
}: PricePerTokenProps) {
  const [[assetFrom, assetTo], setAssets] = useState<
    [Asset | null, Asset | null]
  >([null, null]);
  const isTyping = useValueIsTyping();

  useEffect(() => {
    if (swapState?.direction === ActiveInput.from) {
      setAssets([
        createAsset(swapState.coinFrom.symbol, swapState.amount),
        createAsset(swapState.coinTo.symbol, previewAmount),
      ]);
    } else if (swapState) {
      setAssets([
        createAsset(swapState.coinFrom.symbol, previewAmount),
        createAsset(swapState.coinTo.symbol, swapState.amount),
      ]);
    }
  }, [swapState, previewAmount]);

  function toggle() {
    setAssets([assetTo, assetFrom]);
  }

  if (isTyping || isLoading) return null;
  if (!assetFrom?.amount || !assetTo?.amount) return null;
  const pricePerToken = getPricePerToken(assetFrom.amount, assetTo.amount);

  return (
    <div className={style.wrapper}>
      <div>
        <span className="text-gray-200">1</span> {assetFrom.symbol} ={" "}
        <span className="text-gray-200">{pricePerToken}</span> {assetTo.symbol}
      </div>
      <Button size="sm" className="h-auto p-0 border-none" onPress={toggle}>
        <AiOutlineSwap size={20} />
      </Button>
    </div>
  );
}
