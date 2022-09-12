import Decimal from 'decimal.js';

import type { PoolInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export function getPoolRatio(info?: PoolInfoOutput) {
  if (!info) return new Decimal(1);
  const tokenReserve = info.token_reserve;
  const ethReserve = info.eth_reserve;
  return new Decimal(ethReserve.toHex()).div(tokenReserve.toHex());
}
