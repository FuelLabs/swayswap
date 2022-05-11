import { parseUnits } from 'ethers/lib/utils';

export const FUEL_PROVIDER_URL =
  process.env.REACT_APP_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';
export const FUEL_FAUCET_URL =
  process.env.REACT_APP_FUEL_FAUCET_URL || 'https://faucet-fuel-core.swayswap.io/dispense';
export const CONTRACT_ID = process.env.REACT_APP_CONTRACT_ID!;
export const TOKEN_ID = process.env.REACT_APP_TOKEN_ID!;
export const DECIMAL_UNITS = 3;
export const FAUCET_AMOUNT = parseUnits('0.5', DECIMAL_UNITS);
export const MINT_AMOUNT = parseUnits('2000', DECIMAL_UNITS);
export const ONE_ASSET = parseUnits('1', DECIMAL_UNITS).toNumber();
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY!;
export const ENABLE_FAUCET_API = Boolean(process.env.REACT_APP_ENABLE_FAUCET_API)!;
