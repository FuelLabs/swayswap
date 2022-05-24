import { SLIPPAGE_TOLERANCE } from '~/config';

export function useSlippage() {
  return {
    value: SLIPPAGE_TOLERANCE,
    formatted: `${SLIPPAGE_TOLERANCE * 100}%`,
  };
}
