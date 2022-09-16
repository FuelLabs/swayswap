import type Decimal from 'decimal.js';
import type { BN, CoinQuantity } from 'fuels';
import type { QueryClient } from 'react-query';

import { ZERO } from '../Core';
import type { TransactionCost } from '../Core/utils/gas';

import type { Coin, Maybe } from '~/types';
import type { ExchangeContractAbi } from '~/types/contracts';
import type { PoolInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export enum AddLiquidityActive {
  'from' = 'from',
  'to' = 'to',
}

export type LiquidityPreview = {
  liquidityTokens: BN;
  requiredAmount: BN;
};

export type AddLiquidityMachineContext = {
  client: QueryClient;
  coinFrom: Coin;
  coinTo: Coin;
  active: Maybe<AddLiquidityActive>;
  fromAmount: Maybe<BN>;
  toAmount: Maybe<BN>;
  contract: Maybe<ExchangeContractAbi>;
  liquidityPreview: LiquidityPreview;
  poolShare: Decimal;
  poolInfo: Maybe<PoolInfoOutput>;
  poolRatio: Maybe<Decimal>;
  poolPosition: Maybe<BN>;
  balances: Array<CoinQuantity>;
  transactionCost: Maybe<TransactionCost>;
};

export const liquidityPreviewEmpty: LiquidityPreview = {
  liquidityTokens: ZERO,
  requiredAmount: ZERO,
};
