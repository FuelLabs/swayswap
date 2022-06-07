import type { Wallet } from 'fuels';

import * as useContract from '../useContract';

import { CONTRACT_ID } from '~/config';
import { ExchangeContractAbi__factory } from '~/types/contracts';

export function mockUseContract(wallet: Wallet) {
  const res = ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet);
  return jest.spyOn(useContract, 'useContract').mockImplementation(() => res);
}
