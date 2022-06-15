import { toBigInt, toNumber } from 'fuels';

import { divideFnValidOnly, ZERO } from '~/systems/Core';
import type { Maybe } from '~/types';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

export function calculateRatio(initialFromAmount?: Maybe<bigint>, initialToAmount?: Maybe<bigint>) {
  const fromAmount = initialFromAmount || ZERO;
  const toAmount = initialToAmount || ZERO;
  const ratio = toNumber(fromAmount) / toNumber(toAmount);
  return Number.isNaN(ratio) || !Number.isFinite(ratio) ? 0 : ratio;
}

export function getPoolRatio(info?: PoolInfo) {
  const tokenReserve = toBigInt(info?.token_reserve || ZERO);
  const ethReserve = toBigInt(info?.eth_reserve || ZERO);
  return divideFnValidOnly(ethReserve, tokenReserve);
}
