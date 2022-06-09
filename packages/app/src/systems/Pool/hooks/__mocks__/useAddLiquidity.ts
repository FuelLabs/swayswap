import type { Wallet } from 'fuels';

import { CONTRACT_ID, DECIMAL_UNITS } from '~/config';
import { COIN_ETH, parseUnits, TOKENS } from '~/systems/Core';
import { ExchangeContractAbi__factory } from '~/types/contracts';

const FROM_ASSET = COIN_ETH;

const TO_ASSET = TOKENS[1].assetId;

function toAmountWei(amount: string) {
  return parseUnits(amount, DECIMAL_UNITS).toBigInt();
}

export async function addLiquidity(wallet: Wallet, fromAmountEth: string, toAmountEth: string) {
  const contract = ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet);
  await contract.submit.deposit({
    forward: [toAmountWei(fromAmountEth), FROM_ASSET],
  });
  // Deposit coins to
  await contract.submit.deposit({
    forward: [toAmountWei(toAmountEth), TO_ASSET],
  });
  // Create liquidity pool
  return contract.submit.add_liquidity(1, 5000, {
    variableOutputs: 2,
    gasLimit: 100_000_000,
  });
}
