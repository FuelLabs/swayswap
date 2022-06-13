// This is script is made to help
// To deploy and initialize pools
import dotenv from 'dotenv';
import { NativeAssetId, Wallet } from 'fuels';
import path from 'path';

import { ExchangeContractAbi__factory, TokenContractAbi__factory } from '../../src/types/contracts';

const NODE_ENV = process.env.NODE_ENV;

dotenv.config({
  path: path.join(__dirname, `../../.env${NODE_ENV ? `.${NODE_ENV}` : ''}`),
});

const {
  WALLET_SECRET,
  TOKEN_AMOUNT,
  ETH_AMOUNT,
  PROVIDER_URL,
  BYTE_PRICE,
  GAS_PRICE,
  VITE_CONTRACT_ID,
  VITE_TOKEN_ID,
} = process.env;

if (!WALLET_SECRET) {
  process.stdout.write('WALLET_SECRET is not detected!\n');
  process.exit(1);
}

async function main() {
  const wallet = new Wallet(WALLET_SECRET!, PROVIDER_URL);
  const exchange = ExchangeContractAbi__factory.connect(VITE_CONTRACT_ID!, wallet);
  const token = TokenContractAbi__factory.connect(VITE_TOKEN_ID!, wallet);
  const tokenAmount = BigInt(TOKEN_AMOUNT || '2000000000000000');
  const ethAmount = BigInt(ETH_AMOUNT || '1000500000000');
  const mintAmount = BigInt('2000000000000');
  const overrides = {
    gasPrice: BigInt(GAS_PRICE || 0),
    bytePrice: BigInt(BYTE_PRICE || 0),
  };
  const address = {
    value: wallet.address,
  };
  const tokenId = {
    value: token.id,
  };

  try {
    process.stdout.write('Initialize Token Contract\n');
    await token.submit.initialize(mintAmount, address, overrides);
  } catch (err) {
    process.stdout.write('Token Contract already initialized\n');
  }

  await token.submit.mint_coins(tokenAmount, overrides);
  await token.submit.transfer_token_to_output(tokenAmount, tokenId, address, {
    ...overrides,
    variableOutputs: 1,
  });
  const deadline = await wallet.provider.getBlockNumber();

  process.stdout.write('Depositing ETH\n');
  await exchange.submit.deposit({
    forward: [ethAmount, NativeAssetId],
    ...overrides,
  });
  process.stdout.write('Depositing Token\n');
  await exchange.submit.deposit({
    forward: [tokenAmount, token.id],
    ...overrides,
  });
  process.stdout.write('Add liquidity\n');
  await exchange.submit.add_liquidity(1, deadline + BigInt(1000), {
    ...overrides,
    variableOutputs: 2,
    gasLimit: 100_000_000,
  });
}

main();
