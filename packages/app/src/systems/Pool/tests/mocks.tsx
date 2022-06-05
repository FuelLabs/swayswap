export const mockEmptyLiquidityPool = () => {
  jest.mock("../hooks/useUserPositions.tsx", () => ({
    useUserPositions: () => ({
      ethReserve: BigInt(0),
      formattedEthReserve: "0.0",
      formattedPoolShare: "0.0",
      formattedPoolTokens: "0",
      formattedPooledDAI: "0.0",
      formattedPooledETH: "0.0",
      formattedTokenReserve: "0.0",
      hasPositions: false,
      poolRatio: 0,
      poolShare: 0,
      poolTokens: undefined,
      poolTokensNum: BigInt(0),
      pooledDAI: 0,
      pooledETH: 0,
      tokenReserve: BigInt(0),
      totalLiquidity: BigInt(0),
    }),
  }));

  return () => jest.unmock("../hooks/useUserPositions.tsx");
};
