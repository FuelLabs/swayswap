import { parseUnits, randomBytes } from 'ethers/lib/utils';
import {
  Contract,
  ContractFactory,
  NativeAssetId,
  ScriptTransactionRequest,
  Wallet,
  ZeroBytes32,
  BytesLike,
  hexlify,
  Provider
} from 'fuels';
import fs from 'fs';
import path from 'path';
import { TextEncoder } from 'util';

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

export async function createWallet() {
  console.log('Create wallet...');
  console.log('connected to', providerUrl);
  const wallet = Wallet.generate({ provider: providerUrl });
  console.log('Funding wallet with some coins');
  await seedWallet(wallet);

  return wallet;
}

export async function deployContract(contextLog: string, wallet: Wallet, binaryPath: string, abi: any, storageSlots: [BytesLike, BytesLike][] = []) {
  // Deploy
  console.log(contextLog, 'Load contract binary...');
  const bytecode = fs.readFileSync(binaryPath);
  console.log(contextLog, 'Deploy contract...');
  const factory = new ContractFactory(bytecode, abi, wallet);
  const contract = await factory.deployContract(storageSlots, ZeroBytes32);

  console.log(contextLog, 'Contract deployed...');
  return contract;
}

export async function contractExists(contractId: string): Promise<boolean> {
  const provider = new Provider(providerUrl);
  const contract = await provider.getContract(contractId);
  
  return !!contract;
}

export function getBinPath(contractName: string) {
  return path.join(
    __dirname,
    `../../contracts/${contractName}/out/debug/${contractName}.bin`
  );
}

export function encodeTextToB256(text: string) {
  const bytes = new Uint8Array(32);
  const textEncoder = new TextEncoder();

  bytes.set(textEncoder.encode(text));

  return hexlify(bytes);
}