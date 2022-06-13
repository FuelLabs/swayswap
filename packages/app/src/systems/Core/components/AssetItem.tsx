import { useCoinInput } from "../hooks/useCoinInput";

import { CoinInput } from "./CoinInput";
import { CoinSelector } from "./CoinSelector";

import type { Coin } from "~/types";

type Asset = Coin & { amount: bigint };
type AssetItemProps = {
  coin: Asset;
};

export function AssetItem({ coin }: AssetItemProps) {
  const input = useCoinInput({
    coin,
    amount: coin.amount,
    isReadOnly: true,
    showBalance: false,
    showMaxButton: false,
  });

  return (
    <CoinInput
      {...input.getInputProps()}
      rightElement={<CoinSelector {...input.getCoinSelectorProps()} />}
    />
  );
}
