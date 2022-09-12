import type { BN } from 'fuels';

import { useUserPositions } from './useUserPositions';

import { divide, maxAmount, minimumZero, multiply, format, safeBigInt } from '~/systems/Core';
import type { Maybe } from '~/types';

export interface UsePreviewRemoveLiquidity {
  amountToRemove?: Maybe<BN>;
}

export function usePreviewRemoveLiquidity({ amountToRemove }: UsePreviewRemoveLiquidity) {
  const { tokenReserve, ethReserve, totalLiquidity, poolTokensNum, poolTokens } =
    useUserPositions();

  const amountToRemoveNum = safeBigInt(amountToRemove);
  const userLPTokenBalance = safeBigInt(poolTokens);

  const previewDAIRemoved = divide(
    multiply(maxAmount(amountToRemoveNum, userLPTokenBalance), tokenReserve),
    totalLiquidity
  );
  const previewETHRemoved = divide(
    multiply(maxAmount(amountToRemoveNum, userLPTokenBalance), ethReserve),
    totalLiquidity
  );
  const formattedPreviewDAIRemoved = format(minimumZero(previewDAIRemoved));
  const formattedPreviewETHRemoved = format(minimumZero(previewETHRemoved));

  const nextCurrentPoolTokens = minimumZero(poolTokensNum.sub(amountToRemoveNum));
  const nextPoolShare = divide(nextCurrentPoolTokens, totalLiquidity);
  const formattedNextCurrentPoolTokens = format(minimumZero(nextCurrentPoolTokens));
  const formattedNextPoolShare = format(nextPoolShare.mul(100), 6);

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
