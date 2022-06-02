/* eslint-disable no-console */
/**
 * Deploy contract to SwaySwap node.
 */
import fs from 'fs';
import type { Interface, JsonAbi } from 'fuels';
import { NativeAssetId, ContractFactory, ZeroBytes32, TestUtils, Provider, Wallet } from 'fuels';
import path from 'path';

import { ExchangeContractAbi__factory, TokenContractAbi__factory } from '../src/types/contracts';

const tokenPath = path.join(
  __dirname,
  '../../../contracts/token_contract/out/debug/token_contract.bin'
);
const contractPath = path.join(
  __dirname,
  '../../../contracts/exchange_contract/out/debug/exchange_contract.bin'
);
const providerUrl = process.env.VITE_FUEL_PROVIDER_URL!;
const walletSecret = process.env.WALLET_SECRET!;

async function deployContractBinary(
  contextLog: string,
  wallet: Wallet,
  binaryPath: string,
  abi: JsonAbi | Interface
) {
  // Deploy contract binary
  console.log(contextLog, 'Load contract binary...');
  const bytecode = fs.readFileSync(binaryPath);
  console.log(contextLog, 'Deploy contract...');
  const factory = new ContractFactory(bytecode, abi, wallet);
  const contract = await factory.deployContract({
    salt: ZeroBytes32,
    stateRoot: ZeroBytes32,
  });
  console.log(contextLog, 'Contract deployed...');
  return contract;
}

(async function main() {
  try {
    console.log('Create wallet...');
    console.log('Connected to', providerUrl);
    const provider = new Provider(providerUrl);
    let wallet;
    if (walletSecret) {
      console.log('Using wallet secret');
      wallet = new Wallet(walletSecret, provider);
    } else {
      console.log('Funding wallet with some coins');
      wallet = await TestUtils.generateTestWallet(provider, [[100_000_000, NativeAssetId]]);
    }

    const contract = await deployContractBinary(
      'SwaySwap',
      wallet,
      contractPath,
      ExchangeContractAbi__factory.abi
    );
    const token = await deployContractBinary(
      'Token',
      wallet,
      tokenPath,
      TokenContractAbi__factory.abi
    );

    console.log('SwaySwap Contract Id', contract.id);
    // todo: change .env to - add log to updated
    console.log('Token Contract Id', token.id);
  } catch (err) {
    console.error(err);
  }
})();
