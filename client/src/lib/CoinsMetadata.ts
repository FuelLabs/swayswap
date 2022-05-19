import { Coin } from 'src/types';
import { CONTRACT_ID, TOKEN_ID } from 'src/config';

const CoinsMetadata: Array<Coin> = [
  {
    name: 'Ether',
    symbol: 'ETH',
    assetId: '0x0000000000000000000000000000000000000000000000000000000000000000',
    img: '/icons/eth.svg',
  },
  {
    name: 'DAI',
    symbol: 'DAI',
    // TODO: Remove this when adding dynamic token insertion
    // Make temporarily easy to change token contract id
    // https://github.com/FuelLabs/swayswap-demo/issues/33
    assetId: TOKEN_ID,
    img: '/icons/dai.svg',
  },
  {
    name: 'Sway',
    symbol: 'SWAY',
    // TODO: Remove this when adding dynamic token insertion
    // Make temporarily easy to change token contract id
    // https://github.com/FuelLabs/swayswap-demo/issues/33
    assetId: CONTRACT_ID,
    img: '/icons/sway.svg',
  },
];

export default CoinsMetadata;
