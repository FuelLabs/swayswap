const { VITE_FUEL_PROVIDER_URL, VITE_FUEL_FAUCET_URL, VITE_CONTRACT_ID, VITE_TOKEN_ID } =
  process.env;

describe('Test env variables', () => {
  it('Check envs', () => {
    expect(VITE_FUEL_PROVIDER_URL).toBe('http://localhost:4001/graphql');
    expect(VITE_FUEL_FAUCET_URL).toBe('http://localhost:4041/dispense');
    expect(VITE_CONTRACT_ID).toBeTruthy();
    expect(VITE_TOKEN_ID).toBeTruthy();
  });
});
