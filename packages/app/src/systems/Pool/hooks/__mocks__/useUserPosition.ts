import Decimal from 'decimal.js';

import type { PoolInfoPreview } from '../../utils/helpers';
import * as useUserPositions from '../useUserPositions';

import { ZERO } from '~/systems/Core';

const NO_POSITIONS: PoolInfoPreview = {
  ethReserve: ZERO,
  formattedEthReserve: '0.0',
  formattedPoolShare: '0.0',
  formattedPoolTokens: '0',
  formattedPooledDAI: '0.0',
  formattedPooledETH: '0.0',
  formattedTokenReserve: '0.0',
  hasPositions: false,
  poolRatio: new Decimal(0),
  poolShare: new Decimal(0),
  poolTokens: ZERO,
  pooledDAI: ZERO,
  pooledETH: ZERO,
  tokenReserve: ZERO,
  totalLiquidity: ZERO,
};

export function mockUseUserPosition(opts?: Partial<PoolInfoPreview>) {
  return jest.spyOn(useUserPositions, 'useUserPositions').mockImplementation(() => ({
    ...NO_POSITIONS,
    ...opts,
  }));
}
