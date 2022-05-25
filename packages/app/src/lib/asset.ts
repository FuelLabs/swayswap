import { toNumber } from 'fuels';

import { ONE_ASSET } from '~/config';

export const calculateRatio = (
  initialFromAmount?: bigint | null,
  initialToAmount?: bigint | null
) => {
  const fromAmount = initialFromAmount || BigInt(0);
  const toAmount = initialToAmount || BigInt(0);
  const ratio = toNumber(fromAmount) / toNumber(toAmount);

  return Number.isNaN(ratio) || !Number.isFinite(ratio) ? 0 : ratio;
};
