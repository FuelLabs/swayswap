import { divideFnValidOnly, safeBigInt } from '~/systems/Core';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

export function getPoolRatio(info?: PoolInfo) {
  const tokenReserve = safeBigInt(info?.token_reserve);
  const ethReserve = safeBigInt(info?.eth_reserve);
  return divideFnValidOnly(ethReserve, tokenReserve);
}
