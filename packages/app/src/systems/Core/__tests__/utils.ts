import type { Wallet } from 'fuels';

import { objectId } from '../utils';

import { FUEL_FAUCET_URL, TOKEN_ID } from '~/config';
import { TokenContractAbi__factory } from '~/types/contracts';

export async function faucet(wallet: Wallet, captcha?: string | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await (
    await fetch(FUEL_FAUCET_URL, {
      method: 'POST',
      body: JSON.stringify({
        address: wallet?.address,
        captcha: captcha || '',
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();

  if (response.status !== 'Success') {
    throw new Error(`Invalid faucet response: ${JSON.stringify(response)}`);
  }
}
export async function mint(wallet: Wallet, mintAmount: bigint) {
  const contract = TokenContractAbi__factory.connect(TOKEN_ID, wallet);
  await contract.submit.mint_coins(mintAmount);
  await contract.submit.transfer_coins_to_output(
    mintAmount,
    objectId(contract.id),
    objectId(wallet.address),
    { variableOutputs: 1 }
  );
}
