import fs from 'fs';
import { hexZeroPad } from 'fuels';
import { NativeAssetId } from 'fuels';
import { hexlify } from 'fuels';
import { BigNumber } from 'fuels';
import path from 'path';
import { deploySwapContract, deployToken } from './deployContract';
import { data } from './tokens.json';

interface Coin {
    assetId: string;
    name: string;
    img: string;
}

interface SwapContract {
    swapId: string;
    tokenSource: string;
    tokenTo: string;
}

(async function () {
    let index = BigNumber.from('0x0000000000000000000000000000000000000000000000000000000000000000');
    const metadata: {
        tokens: Array<Coin>,
        swapContracts: Array<SwapContract>
    } = { 
        swapContracts: [],
        tokens: [{
            name: 'ETH',
            assetId: '0x0000000000000000000000000000000000000000000000000000000000000000',
            img: '/icons/ETH.svg',
        }]
    };
    
    for (let i = 0; i < data.length; i++) {
        index = index.add(1);
        const coin = data[i];
        const salt = hexZeroPad(hexlify(index), 32);
        const token_id = await deployToken(coin.ticker, salt);

        metadata.tokens.push({
            name: coin.ticker,
            img: `/icons/${coin.ticker}.svg`,
            assetId: token_id
        });

        const swap_id = await deploySwapContract(token_id, salt);

        metadata.swapContracts.push({
            tokenSource: NativeAssetId,
            tokenTo: token_id,
            swapId: swap_id
        });
    }

    fs.writeFileSync(path.join(__dirname, '../src/metadata.json'), JSON.stringify(metadata, null, 2));
})();
