import Decimal from 'decimal.js';

import { isZero } from '~/systems/Core';
import type { PoolInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export function getPoolRatio(info?: PoolInfoOutput) {
  if (!info) return new Decimal(1);
  const tokenReserve = info.token_reserve;
  const ethReserve = info.eth_reserve;
  if (isZero(tokenReserve)) return new Decimal(1);
  return new Decimal(ethReserve.toHex()).div(tokenReserve.toHex());
}
