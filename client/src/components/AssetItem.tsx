import { formatUnits } from "ethers/lib/utils";
import { Coin, CoinInput, useCoinInput } from "./CoinInput";
import { DECIMAL_UNITS } from "src/config";
import { useMemo } from "react";

type Asset = Coin & { amount: bigint };
type AssetItemProps = {
  coin: Asset;
};

export function AssetItem({ coin }: AssetItemProps) {
  const amount = useMemo(
    () => formatUnits(coin.amount, DECIMAL_UNITS),
    [coin.amount]
  );
  const input = useCoinInput({
    amount,
    coin,
    coins: coin ? [coin] : [],
    disabled: true,
  });

  return <CoinInput {...input.getInputProps()} />;
}
