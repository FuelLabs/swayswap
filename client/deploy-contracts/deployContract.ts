/**
 * Deploy contract to SwaySwap node.
 */

// TODO: Remove this file after `forc` enabled deploy a contract to a custom url
// https://github.com/FuelLabs/sway/issues/1308
import { hexlify, parseUnits, randomBytes } from 'ethers/lib/utils';
import {
  ContractFactory,
  NativeAssetId,
  ScriptTransactionRequest,
  Wallet,
  BytesLike,
} from 'fuels';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import { SwayswapContractAbi__factory, TokenContractAbi__factory } from '../src/types/contracts';

const tokenPath = path.join(
  __dirname,
  '../../contracts/token_contract/out/debug/token_contract.bin'
);
const contractPath = path.join(
  __dirname,
  '../../contracts/swayswap_contract/out/debug/swayswap_contract.bin'
);
const providerUrl = process.env.REACT_APP_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';

export const seedWallet = async (wallet: Wallet) => {
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
    amount: parseUnits('.5', 9),
    owner: '0xf1e92c42b90934aa6372e30bc568a326f6e66a1a0288595e6e3fbd392a4f3e6e',
  });
  transactionRequest.addCoinOutput(wallet.address, parseUnits('.5', 9), NativeAssetId);
  const submit = await wallet.sendTransaction(transactionRequest);

  return submit.wait();
};

export async function deployContract(contextLog: string, binaryPath: string, abi: any, salt: BytesLike) {
  console.log(contextLog, 'Create wallet...');
  console.log(contextLog, 'connected to', providerUrl);
  const wallet = Wallet.generate({ provider: providerUrl });

  console.log(contextLog, 'Funding wallet with some coins');
  await seedWallet(wallet);

  // Deploy
  console.log(contextLog, 'Load contract binary...');
  const bytecode = fs.readFileSync(binaryPath);
  console.log(contextLog, 'Deploy contract...');
  const factory = new ContractFactory(bytecode, abi, wallet);
  const contract = await factory.deployContract(salt);
  console.log(contextLog, 'Contract deployed...');
  return contract;
}

export async function deploySwapContract(token_id: string, salt: BytesLike) {
  const contract = await deployContract(
    'SwaySwap',
    contractPath,
    SwayswapContractAbi__factory.abi,
    salt
  );

  // Retrieve token id from contract to check if is already set
  const tokenOnContract = await contract.functions.get_token({
    value: token_id
  });
  // Check if token is already set
  if (tokenOnContract.value !== token_id) {
    await contract.functions.set_token({
      value: token_id
    });
  }

  return contract.id;
}

export async function deployToken(ticker: string, salt: BytesLike) {
  const token = await deployContract('Token', tokenPath, TokenContractAbi__factory.abi, salt);

  return token.id;
}

// (async function () {
//   try {
//     const contract = await deployContract(
//       'SwaySwap',
//       contractPath,
//       SwayswapContractAbi__factory.abi
//     );
//     const token = await deployContract('Token', tokenPath, TokenContractAbi__factory.abi);

//     console.log('SwaySwap Contract Id', contract.id);
//     console.log('Token Contract Id', token.id);
//   } catch (err) {
//     console.error(err);
//   }
// })();
