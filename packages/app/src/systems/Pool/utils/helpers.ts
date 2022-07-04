import { divideFnValidOnly, safeBigInt } from '~/systems/Core';
import type { PoolInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export function getPoolRatio(info?: PoolInfoOutput) {
  const tokenReserve = safeBigInt(info?.token_reserve);
  const ethReserve = safeBigInt(info?.eth_reserve);
  return divideFnValidOnly(ethReserve, tokenReserve);
}
