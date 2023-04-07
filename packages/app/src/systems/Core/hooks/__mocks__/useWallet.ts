import type { Fuel, FuelWalletLocked } from '@fuel-wallet/sdk';

import * as useFuel from '../useFuel';
import * as useWallet from '../useWallet';

import { MockConnection } from './MockConnection';

import { faucet } from '~/systems/Faucet/hooks/__mocks__/useFaucet';
import { mint } from '~/systems/Mint/hooks/__mocks__/useMint';
import { setAgreement, SWAYSWAP_ASSETS } from '~/systems/Welcome/machines';

export function createFuel(isConnectedOverride = true) {
  const mockFuel = MockConnection.start(isConnectedOverride);
  return mockFuel as unknown as Fuel;
}

export async function createWallet(isConnectedOverride = true) {
  const mockFuel = createFuel(isConnectedOverride);
  const currentAccount = await mockFuel.currentAccount();
  const wallet = await mockFuel.getWallet(currentAccount);
  return { wallet, fuel: mockFuel };
}

export function mockUseWallet(wallet: FuelWalletLocked) {
  return jest.spyOn(useWallet, 'useWallet').mockImplementation(() => {
    return {
      wallet,
      isLoading: false,
      isError: false,
    };
  });
}

export function mockUseFuel(fuel: Fuel) {
  window.fuel = fuel;
  return jest.spyOn(useFuel, 'useFuel').mockImplementation(() => {
    return {
      fuel,
      isLoading: false,
      error: '',
    };
  });
}

export async function mockUserData(opts: { faucetQuantity?: number } = {}) {
  setAgreement(true);
  const { wallet, fuel } = await createWallet();
  mockUseFuel(fuel);
  mockUseWallet(wallet);
  fuel.addAssets(SWAYSWAP_ASSETS);
  await faucet(wallet, opts.faucetQuantity || 2);
  await mint(wallet);
  return { wallet, fuel };
}

export async function clearMockUserData() {
  setAgreement(false);
  window.fuel = createFuel();
}
