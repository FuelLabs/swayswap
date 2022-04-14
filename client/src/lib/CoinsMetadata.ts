import { Coin } from "src/components/CoinInput";

const CoinsMetadata: Array<Coin> = [
  {
    "name": "ETH",
    "assetId": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "img": "/icons/eth.svg"
  },
  {
    "name": "DAI",
    // TODO: Remove this when adding dynamic token insertion
    // Make temporarily easy to change token contract id
    // https://github.com/FuelLabs/swayswap-demo/issues/33
    "assetId": process.env.REACT_APP_TOKEN_ID,
    "img": "/icons/dai.svg"
  }
]
 
export default CoinsMetadata;