import type { BigNumberish } from 'fuels';
import { bn, NativeAssetId } from 'fuels';

import type { ExchangeContractAbi, TokenContractAbi } from '../../src/types/contracts';

const { TOKEN_AMOUNT, ETH_AMOUNT } = process.env;

export async function initializePool(
  tokenContract: TokenContractAbi,
  exchangeContract: ExchangeContractAbi,
  overrides: { gasPrice: BigNumberish }
) {
  // const wallet = tokenContract.wallet!;
  const tokenAmount = bn(TOKEN_AMOUNT || '0x44364C5BB0000');
  const ethAmount = bn(ETH_AMOUNT || '0xE8F2727500');
  const address = {
    value: tokenContract.account!.address!.toString(),
  };
  const tokenId = {
    value: tokenContract.id.toB256(),
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
  const deadline = await tokenContract.provider!.getBlockNumber();
  await exchangeContract
    .multiCall([
      exchangeContract.functions.deposit().callParams({
        forward: [ethAmount, NativeAssetId],
      }),
      exchangeContract.functions.deposit().callParams({
        forward: [tokenAmount, tokenContract.id.toB256()],
      }),
      exchangeContract.functions.add_liquidity(1, bn(1000).add(deadline)),
    ])
    .txParams({
      ...overrides,
      variableOutputs: 2,
      gasLimit: 100_000_000,
    })
    .call();
}
