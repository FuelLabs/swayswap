import type { BN } from 'fuels';

import * as useUserPositions from '../useUserPositions';

import { ZERO } from '~/systems/Core';

export type MockUseUserPositionParams = {
  pooledDAI: number;
  pooledETH: number;
  poolShare: number;
  poolTokens: BN;
  poolTokensNum: BN;
  formattedPooledDAI: string;
  formattedPooledETH: string;
  formattedPoolShare: string;
  poolRatio: number;
  ethReserve: BN;
  formattedEthReserve: string;
  formattedPoolTokens: string;
  formattedTokenReserve: string;
  hasPositions: boolean;
  tokenReserve: BN;
  totalLiquidity: BN;
};

const NO_POSITIONS: MockUseUserPositionParams = {
  ethReserve: ZERO,
  formattedEthReserve: '0.0',
  formattedPoolShare: '0.0',
  formattedPoolTokens: '0',
  formattedPooledDAI: '0.0',
  formattedPooledETH: '0.0',
  formattedTokenReserve: '0.0',
  hasPositions: false,
  poolRatio: 0,
  poolShare: 0,
  poolTokens: ZERO,
  poolTokensNum: ZERO,
  pooledDAI: 0,
  pooledETH: 0,
  tokenReserve: ZERO,
  totalLiquidity: ZERO,
};

export function mockUseUserPosition(opts?: Partial<MockUseUserPositionParams>) {
  return jest.spyOn(useUserPositions, 'useUserPositions').mockImplementation(() => ({
    ...NO_POSITIONS,
    ...opts,
  }));
}
