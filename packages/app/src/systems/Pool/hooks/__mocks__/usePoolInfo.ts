import * as usePoolInfo from '../usePoolInfo';

const MOCK_DATA = {
  eth_reserve: BigInt(300000000),
  lp_token_supply: BigInt(300000000),
  token_reserve: BigInt(2000000000000),
};

export function mockUsePoolInfo(fakeData?: typeof MOCK_DATA) {
  const mock = {
    data: fakeData || MOCK_DATA,
    loading: false,
    refetch: () => undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  return jest.spyOn(usePoolInfo, 'usePoolInfo').mockReturnValue(mock);
}
