import { Wallet } from 'fuels';

import * as useWallet from '../useWallet';

import { FUEL_PROVIDER_URL } from '~/config';

export function createWallet() {
  return Wallet.generate({ provider: FUEL_PROVIDER_URL });
}

export function mockUseWallet(wallet: Wallet) {
  return jest.spyOn(useWallet, 'useWallet').mockImplementation(() => wallet);
}
