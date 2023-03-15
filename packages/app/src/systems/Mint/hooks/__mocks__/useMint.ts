import type { FuelWalletLocked } from '@fuel-wallet/sdk';

import { TOKEN_ID2 } from '~/config';
import { getOverrides } from '~/systems/Core/utils/gas';
import { TokenContractAbi__factory } from '~/types/contracts';

export async function mint(wallet: FuelWalletLocked) {
  const contract = TokenContractAbi__factory.connect(TOKEN_ID2, wallet);
  return contract.functions
    .mint()
    .txParams(getOverrides({ variableOutputs: 1 }))
    .call();
}
