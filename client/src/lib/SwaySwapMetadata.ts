import { NativeAssetId } from 'fuels';
import { Coin } from 'src/components/CoinInput';
import coins from 'src/coins.json';

export const NativeAsset = coins.find((c) => c.assetId === NativeAssetId) as Coin;

export const assets = coins as Array<Coin>;

export const filterAssets = (coins: Coin[], assets: Coin[]) =>
  coins.filter((i) => !assets.find((a) => a.assetId === i.assetId));
