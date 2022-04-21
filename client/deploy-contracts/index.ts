/**
 * Deploy contract to SwaySwap node.
 */

// TODO: Remove this file after `forc` enabled deploy a contract to a custom url
// https://github.com/FuelLabs/sway/issues/1308
import { hexlify, parseUnits } from "ethers/lib/utils";
import { ContractFactory, NativeAssetId, ScriptTransactionRequest, Wallet, ZeroBytes32 } from "fuels";
import path from "path";
import fs from "fs";
// @ts-ignore
import { SwayswapContractAbi__factory, TokenContractAbi__factory } from '../src/types/contracts';

const tokenPath = path.join(__dirname, '../../contracts/token_contract/out/debug/token_contract.bin');
const contractPath = path.join(__dirname, '../../contracts/swayswap_contract/out/debug/swayswap_contract.bin');
const providerUrl = process.env.REACT_APP_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';

const genBytes32 = () =>
  hexlify(new Uint8Array(32).map(() => Math.floor(Math.random() * 256)));

export const seedWallet = async (wallet: Wallet) => {
    const transactionRequest = new ScriptTransactionRequest({
      gasPrice: 0,
      gasLimit: "0x0F4240",
      script: "0x24400000",
      scriptData: genBytes32()
    });
    // @ts-ignore
    transactionRequest.addCoin({
      id: "0x000000000000000000000000000000000000000000000000000000000000000000",
      assetId: NativeAssetId,
      amount: parseUnits(".5", 9),
      owner: "0xf1e92c42b90934aa6372e30bc568a326f6e66a1a0288595e6e3fbd392a4f3e6e",
    });
    transactionRequest.addCoinOutput(wallet.address, parseUnits(".5", 9), NativeAssetId);
    const submit = await wallet.sendTransaction(transactionRequest);

    return submit.wait();
}

export async function deployContract(contextLog: string, binaryPath: string, abi: any) {
    console.log(contextLog, 'Create wallet...');
    console.log(contextLog, 'connected to', providerUrl)
    const wallet = Wallet.generate({ provider: providerUrl });
    
    console.log(contextLog, 'Funding wallet with some coins');
    await seedWallet(wallet);

    // Deploy
    console.log(contextLog, 'Load contract binary...');
    const bytecode = fs.readFileSync(binaryPath);
    console.log(contextLog, 'Deploy contract...');
    const factory = new ContractFactory(bytecode, abi, wallet);
    const contract = await factory.deployContract(ZeroBytes32);

    console.log(contextLog, 'Contract deployed...');
    return contract;
}

(async function () {
    try {
        const contract = await deployContract('SwaySwap', contractPath, SwayswapContractAbi__factory.abi);
        const token = await deployContract('Token', tokenPath, TokenContractAbi__factory.abi);

        console.log('SwaySwap Contract Id', contract.id);
        console.log('Token Contract Id', token.id);
    } catch (err) {
        console.error(err);
    }
})();