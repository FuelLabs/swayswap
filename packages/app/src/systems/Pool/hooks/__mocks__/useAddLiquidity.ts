import type { Wallet } from 'fuels';

import { CONTRACT_ID, DEADLINE, DECIMAL_UNITS } from '~/config';
import { COIN_ETH, parseUnits, TOKENS } from '~/systems/Core';
import { ExchangeContractAbi__factory } from '~/types/contracts';

const FROM_AMOUNT = parseUnits('0.1', DECIMAL_UNITS).toBigInt();
const FROM_ASSET = COIN_ETH;

const TO_AMOUNT = parseUnits('500', DECIMAL_UNITS).toBigInt();
const TO_ASSET = TOKENS[1].assetId;

export async function addLiquidity(wallet: Wallet) {
  const contract = ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet);
  await contract.submit.deposit({
    forward: [FROM_AMOUNT, FROM_ASSET],
  });
  // Deposit coins to
  await contract.submit.deposit({
    forward: [TO_AMOUNT, TO_ASSET],
  });
  // Create liquidity pool
  return contract.submit.add_liquidity(1, DEADLINE, {
    variableOutputs: 2,
    gasLimit: 100_000_000,
  });
}
