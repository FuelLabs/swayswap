import type { Wallet } from 'fuels';

import { CONTRACT_ID, DEADLINE, DECIMAL_UNITS } from '~/config';
import { parseUnits, toBigInt } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import { ExchangeContractAbi__factory } from '~/types/contracts';

function toAmountWei(amount: string) {
  return parseUnits(amount, DECIMAL_UNITS).toBigInt();
}

export async function addLiquidity(
  wallet: Wallet,
  fromAmountEth: string,
  toAmountEth: string,
  fromAsset: string,
  toAsset: string
) {
  const contract = ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet);
  const res1 = await contract.submitResult.deposit(
    getOverrides({
      forward: [toAmountWei(fromAmountEth), fromAsset],
      gasLimit: toBigInt(30000),
    })
  );
  // Deposit coins to
  const res2 = await contract.submitResult.deposit(
    getOverrides({
      forward: [toAmountWei(toAmountEth), toAsset],
      gasLimit: toBigInt(30000),
    })
  );
  // Create liquidity pool
  const res3 = await contract.submitResult.add_liquidity(
    1,
    DEADLINE,
    getOverrides({
      variableOutputs: 2,
      gasLimit: toBigInt(1500000),
    })
  );

  return [res1, res2, res3];
}
