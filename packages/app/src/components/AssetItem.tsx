import { CoinInput, useCoinInput } from "./CoinInput";

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
  });

  return (
    <CoinInput
      {...input.getInputProps()}
      showBalance={false}
      showMaxButton={false}
    />
  );
}
