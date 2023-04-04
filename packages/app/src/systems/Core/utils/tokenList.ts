import { relativeUrl } from './relativeUrl';

import { CONTRACT_ID, TOKEN_ID1, TOKEN_ID2 } from '~/config';
import type { Coin } from '~/types';

export const ASSET_404 = {
  name: '404',
  img: relativeUrl('/icons/other.svg'),
};

export const ETH = {
  name: 'sEther',
  symbol: 'sETH',
  assetId: TOKEN_ID1,
  img: relativeUrl('/icons/eth.svg'),
};

export const DAI = {
  name: 'DAI',
  symbol: 'DAI',
  // TODO: Remove this when adding dynamic token insertion
  // Make temporarily easy to change token contract id
  // https://github.com/FuelLabs/swayswap-demo/issues/33
  assetId: TOKEN_ID2,
  img: relativeUrl('/icons/dai.svg'),
};

export const ETH_DAI = {
  name: 'sETH/DAI',
  symbol: 'sETH/DAI',
  // TODO: Remove this when adding dynamic token insertion
  // Make temporarily easy to change token contract id
  // https://github.com/FuelLabs/swayswap-demo/issues/33
  assetId: CONTRACT_ID,
  img: relativeUrl('/icons/eth_dai.svg'),
  pairOf: [ETH, DAI],
};

export const TOKENS: Array<Coin> = [ETH, DAI, ETH_DAI];
