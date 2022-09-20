import type { Wallet } from 'fuels';

import { TOKEN_ID } from '~/config';
import { getOverrides } from '~/systems/Core/utils/gas';
import { TokenContractAbi__factory } from '~/types/contracts';

export async function mint(wallet: Wallet) {
  const contract = TokenContractAbi__factory.connect(TOKEN_ID, wallet);
  return contract.functions
    .mint()
    .txParams(getOverrides({ variableOutputs: 1 }))
    .call();
}
