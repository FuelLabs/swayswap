import {
  getBinPath,
  createWallet,
  deployContract
} from './common';
// @ts-ignore
import { ExchangeContractAbi__factory, SwayswapContractAbi__factory } from '../src/types/contracts';

const contractPath = getBinPath('swayswap_contract');
const exchangePath = getBinPath('exchange_contract');

(async function () {
  try {
    const wallet = await createWallet();
    const contract = await deployContract(
      'SwaySwap',
      wallet,
      contractPath,
      SwayswapContractAbi__factory.abi,
    );
    const exchange = await deployContract('Exchange', wallet, exchangePath, ExchangeContractAbi__factory.abi);

    console.log('SwaySwap Contract Id', contract.id);
    console.log('Exchange Contract Id', exchange.id);
  } catch (err) {
    console.error(err);
  }
})();
