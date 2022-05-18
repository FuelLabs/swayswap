import { Coin, CoinInput, useCoinInput } from "./CoinInput";

type Asset = Coin & { amount: bigint };
type AssetItemProps = {
  coin: Asset;
};

export function AssetItem({ coin }: AssetItemProps) {
  const input = useCoinInput({
    coin,
    coins: coin ? [coin] : [],
    amount: coin.amount,
    isReadOnly: true,
  });

  return <CoinInput {...input.getInputProps()} />;
}
