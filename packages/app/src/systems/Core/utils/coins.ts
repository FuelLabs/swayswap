import type { CoinQuantity } from 'fuels';
import { BaseAssetId } from 'fuels';

export const getCoin = (coinsQuantity: Array<CoinQuantity>, assetId?: string) => {
  return coinsQuantity.find((cq) => cq.assetId === assetId);
};

export const getCoinETH = (coinsQuantity: Array<CoinQuantity>) => {
  return coinsQuantity.find((cq) => cq.assetId === BaseAssetId);
};
