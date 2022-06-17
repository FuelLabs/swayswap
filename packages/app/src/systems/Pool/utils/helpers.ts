import { toNumber } from 'fuels';

import { divideFnValidOnly, safeBigInt } from '~/systems/Core';
import type { Maybe } from '~/types';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

export function calculateRatio(initialFromAmount?: Maybe<bigint>, initialToAmount?: Maybe<bigint>) {
  const fromAmount = safeBigInt(initialFromAmount);
  const toAmount = safeBigInt(initialToAmount);
  const ratio = toNumber(fromAmount) / toNumber(toAmount);
  return Number.isNaN(ratio) || !Number.isFinite(ratio) ? 0 : ratio;
}

export function getPoolRatio(info?: PoolInfo) {
  const tokenReserve = safeBigInt(info?.token_reserve);
  const ethReserve = safeBigInt(info?.eth_reserve);
  return divideFnValidOnly(ethReserve, tokenReserve);
}
