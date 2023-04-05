import type { Fuel, FuelWalletLocked } from '@fuel-wallet/sdk';

import * as useFuel from '../useFuel';
import * as useWallet from '../useWallet';

import { MockConnection } from './MockConnection';

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
