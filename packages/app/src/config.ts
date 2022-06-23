/** Link for the fuel network node */
export const FUEL_PROVIDER_URL = process.env.VITE_FUEL_PROVIDER_URL!;
/**  Link for the fuel faucet */
export const FUEL_FAUCET_URL = process.env.VITE_FUEL_FAUCET_URL!;
/** Id (address) of the deployed swayswap contract */
export const CONTRACT_ID = process.env.VITE_CONTRACT_ID!;
/** Id (address) of the deployed token contract */
export const TOKEN_ID = process.env.VITE_TOKEN_ID!;
/** The site key is used to invoke recaptcha service on the website
 * to disable recaptcha this env should be empty or not declared */
export const RECAPTCHA_KEY = process.env.VITE_FAUCET_RECAPTCHA_KEY!;
/** Decimal units */
export const DECIMAL_UNITS = 9;
/** Amount of tokens to faucet */
export const MINT_AMOUNT = 2000;
/** Slippage tolerance applied on swap and add liquidity */
export const SLIPPAGE_TOLERANCE = 0.005;
/** Small network fee */
export const NETWORK_FEE = 1;
/** Default deadline */
export const DEADLINE = 1000;
/** Max presentation units to avoid show 9 decimals on screen */
export const FIXED_UNITS = 3;
/** Min gas price required from the fuel-core */
export const GAS_PRICE = 1;
/** Min byte price required from the fuel-core */
export const BYTE_PRICE = 1;
/** Base block explorer url */
export const BLOCK_EXPLORER_URL = 'https://fuellabs.github.io/block-explorer-v2';
