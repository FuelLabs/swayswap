import { parseUnits } from 'ethers/lib/utils';

export const FUEL_PROVIDER_URL =
  process.env.REACT_APP_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';
export const SWAYSWAP_CONTRACT_ID = process.env.REACT_APP_SWAYSWAP_ID!;
export const EXCHANGE_CONTRACT_ID = process.env.REACT_APP_EXCHANGE_ID!;
export const TOKEN_ID = process.env.REACT_APP_TOKEN_ID!;
export const FAUCET_AMOUNT = parseUnits('0.5', 9);
export const MINT_AMOUNT = parseUnits('0.5', 9);
