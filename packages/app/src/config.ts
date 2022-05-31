export const FUEL_PROVIDER_URL =
  process.env.VITE_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';

export const FUEL_FAUCET_URL =
  process.env.VITE_FUEL_FAUCET_URL || 'https://faucet-fuel-core.swayswap.io/dispense';

export const CONTRACT_ID = process.env.VITE_CONTRACT_ID!;
export const TOKEN_ID = process.env.VITE_TOKEN_ID!;
export const DECIMAL_UNITS = 9;
// Amount of ether to faucet
export const FAUCET_AMOUNT = 1;
// Amount of tokens to faucet
export const MINT_AMOUNT = 2000;
export const RECAPTCHA_SITE_KEY = process.env.VITE_RECAPTCHA_SITE_KEY!;
export const ENABLE_FAUCET_API = process.env.VITE_ENABLE_FAUCET_API === 'true';
export const SLIPPAGE_TOLERANCE = 0.005;
export const NETWORK_FEE = 1;
export const DEADLINE = 5000;
export const FIXED_UNITS = 3;
