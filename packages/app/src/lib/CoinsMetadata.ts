import { relativeUrl } from './utils';

import { CONTRACT_ID, TOKEN_ID } from '~/config';
import type { Coin } from '~/types';

export const ASSET_404 = {
  name: '404',
  img: relativeUrl('/icons/other.svg'),
};

const ETH = {
  name: 'Ether',
  symbol: 'ETH',
  assetId: '0x0000000000000000000000000000000000000000000000000000000000000000',
  img: relativeUrl('/icons/eth.svg'),
};

const DAI = {
  name: 'DAI',
  symbol: 'DAI',
  // TODO: Remove this when adding dynamic token insertion
  // Make temporarily easy to change token contract id
  // https://github.com/FuelLabs/swayswap-demo/issues/33
  assetId: TOKEN_ID,
  img: relativeUrl('/icons/dai.svg'),
};

export const ETH_DAI = {
  name: 'ETH/DAI',
  symbol: 'ETH/DAI',
  // TODO: Remove this when adding dynamic token insertion
  // Make temporarily easy to change token contract id
  // https://github.com/FuelLabs/swayswap-demo/issues/33
  assetId: CONTRACT_ID,
  pairOf: [ETH, DAI],
};

const CoinsMetadata: Array<Coin> = [ETH, DAI, ETH_DAI];
export default CoinsMetadata;
