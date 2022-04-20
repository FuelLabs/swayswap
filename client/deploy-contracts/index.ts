/**
 * Deploy contract to SwaySwap node.
 */

// TODO: Remove this file after `forc` enabled deploy a contract to a custom url
// https://github.com/FuelLabs/sway/issues/1308
import { seedWallet } from '@fuel-ts/wallet/dist/test-utils';
import { ContractFactory, NativeAssetId, Wallet, ZeroBytes32 } from "fuels";
import path from "path";
import fs from "fs";
// @ts-ignore
import { SwayswapContractAbi__factory, TokenContractAbi__factory } from '../src/types/contracts';

const tokenPath = path.join(__dirname, '../../contracts/token_contract/out/debug/token_contract.bin');
const contractPath = path.join(__dirname, '../../contracts/swayswap_contract/out/debug/swayswap_contract.bin');
const providerUrl = process.env.REACT_APP_FUEL_PROVIDER_URL || 'https://node.swayswap.io/graphql';

export async function deployContract(contextLog: string, binaryPath: string, abi: any) {
    console.log(contextLog, 'Create wallet...');
    console.log(contextLog, 'connected to', providerUrl)
    const wallet = Wallet.generate({ provider: providerUrl });
    
    console.log(contextLog, 'Funding wallet with some coins');
    await seedWallet(wallet, [[5_000_000, NativeAssetId]]);

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
        const contract = await deployContract('SwaySwap', tokenPath, TokenContractAbi__factory.abi);
        const token = await deployContract('Token', contractPath, SwayswapContractAbi__factory.abi);

        console.log('SwaySwap Contract Id', contract.id);
        console.log('Token Contract Id', token.id);
    } catch (err) {
        console.error(err);
    }
})();