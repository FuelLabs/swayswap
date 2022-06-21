import * as useUserPositions from '../useUserPositions';

export type MockUseUserPositionParams = {
  pooledDAI: number;
  pooledETH: number;
  poolShare: number;
  poolTokens: bigint | undefined;
  poolTokensNum: bigint;
  formattedPooledDAI: string;
  formattedPooledETH: string;
  formattedPoolShare: string;
  poolRatio: number;
  ethReserve: bigint;
  formattedEthReserve: string;
  formattedPoolTokens: string;
  formattedTokenReserve: string;
  hasPositions: boolean;
  tokenReserve: bigint;
  totalLiquidity: bigint;
};

const NO_POSITIONS: MockUseUserPositionParams = {
  ethReserve: BigInt(0),
  formattedEthReserve: '0.0',
  formattedPoolShare: '0.0',
  formattedPoolTokens: '0',
  formattedPooledDAI: '0.0',
  formattedPooledETH: '0.0',
  formattedTokenReserve: '0.0',
  hasPositions: false,
  poolRatio: 0,
  poolShare: 0,
  poolTokens: undefined,
  poolTokensNum: BigInt(0),
  pooledDAI: 0,
  pooledETH: 0,
  tokenReserve: BigInt(0),
  totalLiquidity: BigInt(0),
};

export function mockUseUserPosition(opts?: Partial<MockUseUserPositionParams>) {
  return jest.spyOn(useUserPositions, 'useUserPositions').mockImplementation(() => ({
    ...NO_POSITIONS,
    ...opts,
  }));
}
