import type { BigNumberish } from 'fuels';
import { NativeAssetId } from 'fuels';

import type { ExchangeContractAbi, TokenContractAbi } from '../../src/types/contracts';

const { TOKEN_AMOUNT, ETH_AMOUNT } = process.env;

export async function initializePool(
  tokenContract: TokenContractAbi,
  exchangeContract: ExchangeContractAbi,
  overrides: { gasPrice: BigNumberish; bytePrice: BigNumberish }
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

  await tokenContract.functions.mint_coins(tokenAmount).txParams(overrides).call();
  await tokenContract.functions
    .transfer_token_to_output(tokenAmount, tokenId, address)
    .txParams({
      ...overrides,
      variableOutputs: 1,
    })
    .call();

  process.stdout.write('Initialize pool\n');
  const deadline = await wallet.provider.getBlockNumber();
  await exchangeContract
    .multiCall([
      exchangeContract.functions.deposit().callParams({
        forward: [ethAmount, NativeAssetId],
      }),
      exchangeContract.functions.deposit().callParams({
        forward: [tokenAmount, tokenContract.id],
      }),
      exchangeContract.functions.add_liquidity(1, deadline + BigInt(1000)),
    ])
    .txParams({
      ...overrides,
      variableOutputs: 2,
      gasLimit: 100_000_000,
    })
    .call();
}
