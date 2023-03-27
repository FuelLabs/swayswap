import type { BigNumberish } from 'fuels';
import { bn } from 'fuels';

import type { ExchangeContractAbi, TokenContractAbi } from '../../src/types/contracts';

const { SIZE_POOL } = process.env;

export async function initializePool(
  tokenContract1: TokenContractAbi,
  tokenContract2: TokenContractAbi,
  exchangeContract: ExchangeContractAbi,
  overrides: { gasPrice: BigNumberish }
) {
  const walletAddress = {
    value: tokenContract1.account!.address!.toHexString(),
  };
  const sizePool = bn.parseUnits(SIZE_POOL || '0.0');
  const tokenAmount1 = sizePool;
  const tokenId1 = {
    value: tokenContract1.id.toHexString(),
  };

  const tokenAmount2 = sizePool.mul(1000);
  const tokenId2 = {
    value: tokenContract2.id.toHexString(),
  };

  await tokenContract1.functions.mint_coins(tokenAmount1).txParams(overrides).call();
  await tokenContract1.functions
    .transfer_token_to_output(tokenAmount1, tokenId1, walletAddress)
    .txParams({
      ...overrides,
      variableOutputs: 1,
    })
    .call();

  await tokenContract2.functions.mint_coins(tokenAmount2).txParams(overrides).call();
  await tokenContract2.functions
    .transfer_token_to_output(tokenAmount2, tokenId2, walletAddress)
    .txParams({
      ...overrides,
      variableOutputs: 1,
    })
    .call();

  process.stdout.write('Initialize pool\n');
  const deadline = await tokenContract1.provider!.getBlockNumber();
  await exchangeContract
    .multiCall([
      exchangeContract.functions.deposit().callParams({
        forward: [tokenAmount1, tokenContract1.id.toB256()],
      }),
      exchangeContract.functions.deposit().callParams({
        forward: [tokenAmount2, tokenContract2.id.toB256()],
      }),
      exchangeContract.functions.add_liquidity(1, bn(1000).add(deadline)).callParams({
        forward: [bn(0), tokenContract1.id.toB256()],
      }),
    ])
    .txParams({
      ...overrides,
      variableOutputs: 2,
      gasLimit: 100_000_000,
    })
    .call();
}
