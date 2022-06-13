import { useEffect, useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";

import { useValueIsTyping } from "../state";
import type { SwapState } from "../types";
import { SwapDirection } from "../types";
import { getPricePerToken } from "../utils/helpers";

import { ZERO } from "~/systems/Core";
import { Button } from "~/systems/UI";
import type { Maybe } from "~/types";

const style = {
  wrapper: `flex items-center gap-3 my-4 px-2 text-sm text-gray-400`,
  priceContainer: `min-w-[150px] cursor-pointer`,
};

type PricePerTokenProps = {
  swapState?: Maybe<SwapState>;
  previewAmount?: Maybe<bigint>;
  isLoading?: boolean;
};

type Asset = {
  symbol: string;
  amount: bigint;
};

const createAsset = (
  symbol?: Maybe<string>,
  amount?: Maybe<bigint>
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
    [Maybe<Asset>, Maybe<Asset>]
  >([null, null]);
  const isTyping = useValueIsTyping();

  useEffect(() => {
    if (swapState?.direction === SwapDirection.fromTo) {
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
    <div
      className={style.wrapper}
      onClick={toggle}
      aria-label="Price per token"
    >
      <div className={style.priceContainer}>
        <span className="text-gray-200">1</span> {assetFrom.symbol} ={" "}
        <span className="text-gray-200">{pricePerToken}</span> {assetTo.symbol}
      </div>
      <Button
        size="sm"
        className="h-auto p-0 border-none"
        onPress={toggle}
        aria-label="Invert token price"
      >
        <AiOutlineSwap size={20} />
      </Button>
    </div>
  );
}
