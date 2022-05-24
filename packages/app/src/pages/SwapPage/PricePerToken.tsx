import { BigNumber } from "ethers";
import { toNumber } from "fuels";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";

import { swapIsTypingAtom } from "./jotai";
import { ActiveInput } from "./types";

import { Button } from "~/components/Button";
import { DECIMAL_UNITS, ONE_ASSET } from "~/config";

const style = {
  wrapper: `flex items-center gap-3 my-4 px-2 text-sm text-gray-400`,
};

function getPricePerToken(
  direction?: ActiveInput,
  fromAmount?: bigint | null,
  toAmount?: bigint | null
) {
  if (!toAmount || !fromAmount) return "";
  const ratio =
    direction === ActiveInput.from
      ? BigNumber.from(fromAmount || 0).toNumber() /
        BigNumber.from(toAmount || 0).toNumber()
      : BigNumber.from(toAmount || 0).toNumber() /
        BigNumber.from(fromAmount || 0).toNumber();
  const price = ratio * toNumber(ONE_ASSET);
  return (price / toNumber(ONE_ASSET)).toFixed(6);
}

type PricePerTokenProps = {
  fromCoin?: string;
  fromAmount?: bigint | null;
  toCoin?: string;
  toAmount?: bigint | null;
  isLoading?: boolean;
};

export function PricePerToken({
  fromCoin,
  fromAmount,
  toCoin,
  toAmount,
  isLoading,
}: PricePerTokenProps) {
  const [direction, setDirection] = useState<ActiveInput>(ActiveInput.to);
  const isTyping = useAtomValue(swapIsTypingAtom);

  const pricePerToken = getPricePerToken(direction, fromAmount, toAmount);
  const from = direction === ActiveInput.from ? toCoin : fromCoin;
  const to = direction === ActiveInput.from ? fromCoin : toCoin;

  function toggle() {
    setDirection((dir) =>
      dir === ActiveInput.from ? ActiveInput.to : ActiveInput.from
    );
  }

  if (isTyping || isLoading) return null;
  if (!fromAmount || !toAmount) return null;

  return (
    <div className={style.wrapper}>
      <div>
        <span className="text-gray-200">1</span> {from} ={" "}
        <span className="text-gray-200">{pricePerToken}</span> {to}
      </div>
      <Button size="sm" className="h-auto p-0 border-none" onPress={toggle}>
        <AiOutlineSwap size={20} />
      </Button>
    </div>
  );
}
