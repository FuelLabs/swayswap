/* eslint-disable no-console */
/**
 * Deploy contract to SwaySwap node.
 */
import fs from 'fs';
import { NativeAssetId, ContractFactory, ZeroBytes32, TestUtils, Provider } from 'fuels';
import type { Interface, JsonAbi, Wallet } from 'fuels';
import path from 'path';

import config from '../../../docker/fuel-core/chainConfig.json';
import { ExchangeContractAbi__factory, TokenContractAbi__factory } from '../src/types/contracts';

const tokenPath = path.join(
  __dirname,
  '../../../contracts/token_contract/out/debug/token_contract.bin'
);
const contractPath = path.join(
  __dirname,
  '../../../contracts/exchange_contract/out/debug/exchange_contract.bin'
);
const providerUrl = process.env.VITE_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';
// Import the genesis privateKey and export it as environment variable
// This is only sage on test environments
process.env.GENESIS_SECRET = config.wallet.privateKey;

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
    console.log('connected to', providerUrl);
    const provider = new Provider(providerUrl);
    console.log('Funding wallet with some coins');
    const wallet = await TestUtils.generateTestWallet(provider, [[100_000_000, NativeAssetId]]);

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
    console.log('Token Contract Id', token.id);
  } catch (err) {
    console.error(err);
  }
})();
