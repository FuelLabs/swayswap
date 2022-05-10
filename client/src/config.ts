import { parseUnits } from 'ethers/lib/utils';

export const FUEL_PROVIDER_URL =
  process.env.REACT_APP_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';
export const CONTRACT_ID = process.env.REACT_APP_CONTRACT_ID!;
export const TOKEN_ID = process.env.REACT_APP_TOKEN_ID!;
export const DECIMAL_UNITS = 9;
export const FAUCET_AMOUNT = parseUnits('0.5', DECIMAL_UNITS);
export const MINT_AMOUNT = parseUnits('0.5', DECIMAL_UNITS);
export const ONE_ASSET = parseUnits('1', DECIMAL_UNITS).toNumber();
