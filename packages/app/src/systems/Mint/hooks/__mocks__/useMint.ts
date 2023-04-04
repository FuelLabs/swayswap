import type { FuelWalletLocked } from '@fuel-wallet/sdk';

import { TOKEN_ID1, TOKEN_ID2 } from '~/config';
import { getOverrides } from '~/systems/Core/utils/gas';
import { TokenContractAbi__factory } from '~/types/contracts';

export async function mint(wallet: FuelWalletLocked) {
  const tokenContract1 = TokenContractAbi__factory.connect(TOKEN_ID1, wallet);
  const tokenContract2 = TokenContractAbi__factory.connect(TOKEN_ID2, wallet);

  return tokenContract1
    .multiCall([tokenContract1.functions.mint(), tokenContract2.functions.mint()])
    .txParams(getOverrides({ variableOutputs: 1 }))
    .call();
}
