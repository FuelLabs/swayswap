import { Coin } from 'src/components/CoinInput';
import data from 'src/metadata.json';

export const tokens: Array<Coin> = data.tokens;

export const SwapContracts: Array<{
    tokenSource: string,
    tokenTo: string,
    swapId: string,
}> = data.swapContracts;

export const getSwapContract = (coinFrom: Coin, coinTo: Coin) => {
    return SwapContracts.find(swapContract => {
      return (
        (
          swapContract.tokenSource === coinTo.assetId &&
          swapContract.tokenTo === coinFrom.assetId
        ) || (
          swapContract.tokenSource === coinFrom.assetId &&
          swapContract.tokenTo === coinTo.assetId
        )
      )
    });
  }
  
export const getSwappableCoins = (coin: Coin) =>
    data.tokens.filter((asset) => getSwapContract(coin, asset));
  
export const filterCoin = (coins: Coin[], coin: Coin) =>
    coins.filter(i => i.assetId !== coin.assetId);
