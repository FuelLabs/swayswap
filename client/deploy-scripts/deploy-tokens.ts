import {
  getBinPath,
  createWallet,
  deployContract,
  contractExists,
  encodeTextToB256
} from './common';
  // @ts-ignore
import { TokenContractAbi__factory } from '../src/types/contracts';
import fs from 'fs';
import path from 'path';
import { NativeAssetId } from 'fuels';
  
const tokenPath = getBinPath('token_contract');
const coinsDataPath = path.join(__dirname, '../src/coins.json');

(async function () {
  try {
    const wallet = await createWallet();
    const coins = JSON.parse(fs.readFileSync(coinsDataPath).toString());

    await Promise.all(
      coins
      .filter((c: any) => c.assetId !== NativeAssetId)
      .map(async (coin: any) => {
        if (await contractExists(coin.assetId)) return;
        console.log(coin.name, 'Creating token');
        const token = await deployContract(
          'Token',
          wallet,
          tokenPath,
          TokenContractAbi__factory.abi,
          [
            [
              '0x0000000000000000000000000000000000000000000000000000000000000000', 
              encodeTextToB256(coin.name)
            ]
          ]
        );
        console.log(coin.name, 'Token created', token.id);
        coin.assetId = token.id;
      })
    );

    console.log('Update coins.json file');
    fs.writeFileSync(coinsDataPath, JSON.stringify(coins, null, 4));
  } catch (err) {
    console.error(err);
  }
})();
  