import type { Wallet } from 'fuels';

import { TOKEN_ID } from '~/config';
import { objectId } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import { TokenContractAbi__factory } from '~/types/contracts';

export async function mint(wallet: Wallet, mintAmount: bigint) {
  const contract = TokenContractAbi__factory.connect(TOKEN_ID, wallet);
  return contract.submit.mint_and_transfer_coins(
    mintAmount,
    objectId(wallet.address),
    getOverrides({ variableOutputs: 1 })
  );
}
