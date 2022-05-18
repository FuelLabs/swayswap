import { Coin, CoinInput, useCoinInput } from "./CoinInput";

type Asset = Coin & { amount: bigint };
type AssetItemProps = {
  coin: Asset;
};

export function AssetItem({ coin }: AssetItemProps) {
  const input = useCoinInput({
    amount: coin.amount,
    coin,
    coins: coin ? [coin] : [],
    disabled: true,
  });

  return <CoinInput {...input.getInputProps()} />;
}
