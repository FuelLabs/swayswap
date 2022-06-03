import { toNumber, ZERO } from './math';

export const calculateRatio = (
  initialFromAmount?: bigint | null,
  initialToAmount?: bigint | null
) => {
  const fromAmount = initialFromAmount || ZERO;
  const toAmount = initialToAmount || ZERO;
  const ratio = toNumber(fromAmount) / toNumber(toAmount);

  return Number.isNaN(ratio) || !Number.isFinite(ratio) ? 0 : ratio;
};
