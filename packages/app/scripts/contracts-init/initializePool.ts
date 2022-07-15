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
  const tokenAmount = BigInt(TOKEN_AMOUNT || '1200000000000000');
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
    variableOutputs: 1,
  });

  process.stdout.write('Initialize pool\n');
  const deadline = await wallet.provider.getBlockNumber();
  await exchangeContract.submitMulticall(
    [
      exchangeContract.prepareCall.deposit({
        forward: [ethAmount, NativeAssetId],
      }),
      exchangeContract.prepareCall.deposit({
        forward: [tokenAmount, tokenContract.id],
      }),
      exchangeContract.prepareCall.add_liquidity(1, deadline + BigInt(1000), {
        variableOutputs: 2,
      }),
    ],
    {
      ...overrides,
      gasLimit: 100_000_000,
    }
  );
}
