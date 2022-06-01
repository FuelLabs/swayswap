import { useUserPositions } from '~/hooks/useUserPositions';
import {
  divideFnValidOnly,
  maxAmount,
  minimumZero,
  multiplyFn,
  parseToFormattedNumber,
  toFixed,
  ZERO,
} from '~/lib/math';

export interface UsePreviewRemoveLiquidity {
  amountToRemove?: bigint | null;
}

export function usePreviewRemoveLiquidity({ amountToRemove }: UsePreviewRemoveLiquidity) {
  const { tokenReserve, ethReserve, totalLiquidity, poolTokensNum, poolTokens } =
    useUserPositions();
  const amountToRemoveNum = amountToRemove || ZERO;
  const userLPTokenBalance = poolTokens || ZERO;

  const previewDAIRemoved = divideFnValidOnly(
    multiplyFn(maxAmount(amountToRemoveNum, userLPTokenBalance), tokenReserve),
    totalLiquidity
  );
  const previewETHRemoved = divideFnValidOnly(
    multiplyFn(maxAmount(amountToRemoveNum, userLPTokenBalance), ethReserve),
    totalLiquidity
  );
  const formattedPreviewDAIRemoved = parseToFormattedNumber(
    minimumZero(Math.floor(previewDAIRemoved))
  );
  const formattedPreviewETHRemoved = parseToFormattedNumber(
    minimumZero(Math.floor(previewETHRemoved))
  );

  const nextCurrentPoolTokens = minimumZero(poolTokensNum - amountToRemoveNum);
  const nextPoolShare = divideFnValidOnly(nextCurrentPoolTokens, totalLiquidity);
  const formattedNextCurrentPoolTokens = parseToFormattedNumber(minimumZero(nextCurrentPoolTokens));
  const formattedNextPoolShare = toFixed(nextPoolShare * 100, 6);

  return {
    previewDAIRemoved,
    previewETHRemoved,
    nextCurrentPoolTokens,
    nextPoolShare,
    formattedPreviewDAIRemoved,
    formattedPreviewETHRemoved,
    formattedNextCurrentPoolTokens,
    formattedNextPoolShare,
  };
}
