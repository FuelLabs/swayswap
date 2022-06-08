import type { Wallet } from 'fuels';

import * as useContract from '../useContract';

import { CONTRACT_ID } from '~/config';
import { ExchangeContractAbi__factory } from '~/types/contracts';

export function mockUseContract(wallet: Wallet) {
  const mock = ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet);
  return {
    spy: jest.spyOn(useContract, 'useContract').mockImplementation(() => mock),
    contract: mock,
  };
}
