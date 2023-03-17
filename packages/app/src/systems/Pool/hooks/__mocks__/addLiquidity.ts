import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import { bn } from 'fuels';

import { CONTRACT_ID } from '~/config';
import { getDeadline } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import { ExchangeContractAbi__factory } from '~/types/contracts';

export async function addLiquidity(
  wallet: FuelWalletLocked,
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
        forward: [bn.parseUnits(fromAmount), fromAsset],
      }),
      contract.functions.deposit().callParams({
        forward: [bn.parseUnits(toAmount), toAsset],
      }),
      contract.functions.add_liquidity(1, deadline).callParams({
        forward: [bn(0), toAsset],
      }),
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
