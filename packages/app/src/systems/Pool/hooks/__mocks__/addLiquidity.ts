import type { Wallet } from 'fuels';

import { CONTRACT_ID, DECIMAL_UNITS } from '~/config';
import { getDeadline, parseUnits } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import { ExchangeContractAbi__factory } from '~/types/contracts';

function parseToBigInt(amount: string) {
  return parseUnits(amount, DECIMAL_UNITS);
}

export async function addLiquidity(
  wallet: Wallet,
  fromAmount: string,
  toAmount: string,
  fromAsset: string,
  toAsset: string
) {
  const contract = ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet);
  const deadline = await getDeadline(contract);
  const { transactionResult } = await contract
    .multiCall([
      contract.functions.deposit().callParams({
        forward: [parseToBigInt(fromAmount), fromAsset],
      }),
      contract.functions.deposit().callParams({
        forward: [parseToBigInt(toAmount), toAsset],
      }),
      contract.functions.add_liquidity(1, deadline),
    ])
    .txParams(
      getOverrides({
        variableOutputs: 2,
        gasLimit: 20000000,
      })
    )
    .call();
  return transactionResult;
}
