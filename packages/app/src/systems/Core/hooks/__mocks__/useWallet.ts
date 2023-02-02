import type { FuelWalletLocked } from '@fuel-wallet/sdk';

import * as useWallet from '../useWallet';

import { MockConnection } from './MockConnection';

export async function createWallet() {
  const mockFuel = MockConnection.start();
  const currentAccount = await mockFuel.currentAccount();
  const wallet = await mockFuel.getWallet(currentAccount);
  return wallet;
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
