import { toNumber } from 'fuels';

import { DECIMAL_UNITS } from '~/config';
import { useUserPositions } from '~/hooks/useUserPositions';
import { divideFnValidOnly, parseToFormattedNumber } from '~/lib/math';

export interface UsePreviewRemoveLiquidity {
  amountToRemove?: bigint | null;
}

export function usePreviewRemoveLiquidity({ amountToRemove }: UsePreviewRemoveLiquidity) {
  const { tokenReserve, ethReserve, totalLiquidity, poolTokensNum } = useUserPositions();

  const amountToRemoveNum = toNumber(amountToRemove || BigInt(0));

  const previewDAIRemoved = divideFnValidOnly(amountToRemoveNum * tokenReserve, totalLiquidity);
  const previewETHRemoved = divideFnValidOnly(amountToRemoveNum * ethReserve, totalLiquidity);
  const formattedPreviewDAIRemoved = parseToFormattedNumber(
    Math.floor(previewDAIRemoved),
    DECIMAL_UNITS
  );
  const formattedPreviewETHRemoved = parseToFormattedNumber(
    Math.floor(previewETHRemoved),
    DECIMAL_UNITS
  );

  const nextCurrentPoolTokens = poolTokensNum - amountToRemoveNum;
  const nextPoolShare = nextCurrentPoolTokens / totalLiquidity;
  const formattedNextCurrentPoolTokens = parseToFormattedNumber(
    nextCurrentPoolTokens,
    DECIMAL_UNITS
  );
  const formattedNextPoolShare = parseFloat((nextPoolShare * 100).toFixed(6));

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
