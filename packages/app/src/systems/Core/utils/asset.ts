import { toNumber, ZERO } from './math';

import type { Maybe } from '~/types';

export const calculateRatio = (
  initialFromAmount?: Maybe<bigint>,
  initialToAmount?: Maybe<bigint>
) => {
  const fromAmount = initialFromAmount || ZERO;
  const toAmount = initialToAmount || ZERO;
  const ratio = toNumber(fromAmount) / toNumber(toAmount);

  return Number.isNaN(ratio) || !Number.isFinite(ratio) ? 0 : ratio;
};
