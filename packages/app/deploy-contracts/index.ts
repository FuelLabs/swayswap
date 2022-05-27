/* eslint-disable no-console */
/**
 * Deploy contract to SwaySwap node.
 */

// TODO: Remove this file after `forc` enabled deploy a contract to a custom url
// https://github.com/FuelLabs/sway/issues/1308
import {parseUnits, randomBytes} from 'ethers/lib/utils';
import fs from 'fs';
import {ContractFactory, NativeAssetId, ScriptTransactionRequest, Wallet} from 'fuels';
import type {Interface, JsonAbi} from 'fuels';
import path from 'path';

// @ts-ignore
import {ExchangeContractAbi__factory, TokenContractAbi__factory} from '../src/types/contracts';

const tokenPath = path.join(
  __dirname,
  '../../../contracts/token_contract/out/debug/token_contract.bin'
);
const contractPath = path.join(
  __dirname,
  '../../../contracts/exchange_contract/out/debug/exchange_contract.bin'
);
const providerUrl = process.env.VITE_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';

const seedWallet = async (wallet: Wallet) => {
  const transactionRequest = new ScriptTransactionRequest({
    gasPrice: 0,
    gasLimit: '0x0F4240',
    script: '0x24400000',
    scriptData: randomBytes(32),
  });
  // @ts-ignore
  transactionRequest.addCoin({
    id: '0x000000000000000000000000000000000000000000000000000000000000000000',
    assetId: NativeAssetId,
    amount: parseUnits('.5', 9).toBigInt(),
    owner: '0xf1e92c42b90934aa6372e30bc568a326f6e66a1a0288595e6e3fbd392a4f3e6e',
  });
  transactionRequest.addCoinOutput(wallet.address, parseUnits('.5', 9).toBigInt(), NativeAssetId);
  const submit = await wallet.sendTransaction(transactionRequest);

  return submit.wait();
};

async function deployContractBinary(
  contextLog: string,
  binaryPath: string,
  abi: JsonAbi | Interface
) {
  console.log(contextLog, 'Create wallet...');
  console.log(contextLog, 'connected to', providerUrl);
  const wallet = Wallet.generate({provider: providerUrl});

  console.log(contextLog, 'Funding wallet with some coins');
  await seedWallet(wallet);

  // Deploy
  console.log(contextLog, 'Load contract binary...');
  const bytecode = fs.readFileSync(binaryPath);
  console.log(contextLog, 'Deploy contract...');
  const factory = new ContractFactory(bytecode, abi, wallet);
  const contract = await factory.deployContract([], NativeAssetId);

  console.log(contextLog, 'Contract deployed...');
  return contract;
}

(async function main() {
  try {
    const contract = await deployContractBinary(
      'SwaySwap',
      contractPath,
      ExchangeContractAbi__factory.abi
    );
    const token = await deployContractBinary('Token', tokenPath, TokenContractAbi__factory.abi);

    console.log('SwaySwap Contract Id', contract.id);
    console.log('Token Contract Id', token.id);
  } catch (err) {
    console.error(err);
  }
})();
