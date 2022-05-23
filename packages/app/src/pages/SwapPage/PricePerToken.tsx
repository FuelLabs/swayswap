import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { BiRefresh } from "react-icons/bi";

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
      ? BigNumber.from(fromAmount || 0).div(toAmount || 0)
      : BigNumber.from(toAmount || 0).div(fromAmount || 0);
  const price = ratio.mul(ONE_ASSET);
  return formatUnits(price, DECIMAL_UNITS);
}

type PricePerTokenProps = {
  fromCoin?: string;
  fromAmount?: bigint | null;
  toCoin?: string;
  toAmount?: bigint | null;
};

export function PricePerToken({
  fromCoin,
  fromAmount,
  toCoin,
  toAmount,
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

  if (isTyping) return null;
  if (!fromAmount || !toAmount) return null;

  return (
    <div className={style.wrapper}>
      <div>
        <span className="text-gray-200">1</span> {from} ={" "}
        <span className="text-gray-200">{pricePerToken}</span> {to}
      </div>
      <Button size="sm" className="h-auto p-0 border-none" onPress={toggle}>
        <BiRefresh size={20} />
      </Button>
    </div>
  );
}
