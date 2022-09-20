import type { BN, CoinQuantity, Wallet } from 'fuels';
import type { QueryClient } from 'react-query';

import type { TransactionCost } from '../Core/utils/gas';

import type { Coin, Maybe } from '~/types';
import type {
  ExchangeContractAbi,
  PoolInfoOutput,
  PreviewInfoOutput,
} from '~/types/contracts/ExchangeContractAbi';

export type CoinAmount = {
  raw: BN;
  value: string;
};

export enum SwapDirection {
  'fromTo' = 'from',
  'toFrom' = 'to',
}

export type SwapMachineContext = {
  client?: QueryClient;
  wallet?: Maybe<Wallet>;
  contract: Maybe<ExchangeContractAbi>;
  balances?: Maybe<CoinQuantity[]>;
  direction: SwapDirection;
  coinFrom?: Coin;
  coinTo?: Coin;
  coinFromBalance?: Maybe<BN>;
  coinToBalance?: Maybe<BN>;
  ethBalance?: Maybe<BN>;
  amountPlusSlippage?: Maybe<CoinAmount>;
  amountLessSlippage?: Maybe<CoinAmount>;
  fromAmount?: Maybe<CoinAmount>;
  toAmount?: Maybe<CoinAmount>;
  poolInfo?: Maybe<PoolInfoOutput>;
  txCost?: TransactionCost;
  slippage?: number;
  previewInfo?: Maybe<PreviewInfoOutput>;
};
