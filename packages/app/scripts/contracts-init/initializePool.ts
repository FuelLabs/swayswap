import type { Overrides } from 'fuels';
import { NativeAssetId } from 'fuels';

import type { ExchangeContractAbi, TokenContractAbi } from '../../src/types/contracts';

const { TOKEN_AMOUNT, ETH_AMOUNT } = process.env;

export async function initializePool(
  tokenContract: TokenContractAbi,
  exchangeContract: ExchangeContractAbi,
  overrides: Overrides
) {
  const wallet = tokenContract.wallet!;
  const tokenAmount = BigInt(TOKEN_AMOUNT || '2000000000000000');
  const ethAmount = BigInt(ETH_AMOUNT || '1000500000000');
  const address = {
    value: wallet.address,
  };
  const tokenId = {
    value: tokenContract.id,
  };

  await tokenContract.submit.mint_coins(tokenAmount, overrides);
  await tokenContract.submit.transfer_token_to_output(tokenAmount, tokenId, address, {
    ...overrides,
    variableOutputs: 2,
  });
  const deadline = await wallet.provider.getBlockNumber();

  process.stdout.write('Depositing ETH\n');
  await exchangeContract.submit.deposit({
    forward: [ethAmount, NativeAssetId],
    ...overrides,
  });
  process.stdout.write('Depositing Token\n');
  await exchangeContract.submit.deposit({
    forward: [tokenAmount, tokenContract.id],
    ...overrides,
  });
  process.stdout.write('Add liquidity\n');
  await exchangeContract.submit.add_liquidity(1, deadline + BigInt(1000), {
    ...overrides,
    variableOutputs: 2,
    gasLimit: 100_000_000,
  });
}
