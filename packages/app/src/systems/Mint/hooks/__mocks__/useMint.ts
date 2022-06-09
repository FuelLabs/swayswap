import type { Wallet } from 'fuels';

import { TOKEN_ID } from '~/config';
import { objectId } from '~/systems/Core';
import { TokenContractAbi__factory } from '~/types/contracts';

export async function mint(wallet: Wallet, mintAmount: bigint) {
  const contract = TokenContractAbi__factory.connect(TOKEN_ID, wallet);
  await contract.submit.mint_coins(mintAmount);
  return contract.submit.transfer_token_to_output(
    mintAmount,
    objectId(contract.id),
    objectId(wallet.address),
    { variableOutputs: 1 }
  );
}
