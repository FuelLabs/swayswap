import type { CoinQuantity, Wallet } from 'fuels';
import type { QueryClient } from 'react-query';

import type { TransactionCost } from '../Core/utils/gas';

import type { Coin, Maybe } from '~/types';
import type {
  ExchangeContractAbi,
  PoolInfo,
  PreviewInfo,
} from '~/types/contracts/ExchangeContractAbi';

export type CoinAmount = {
  raw: bigint;
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
  coinFromBalance?: Maybe<bigint>;
  coinToBalance?: Maybe<bigint>;
  ethBalance?: Maybe<bigint>;
  amountPlusSlippage?: Maybe<CoinAmount>;
  amountLessSlippage?: Maybe<CoinAmount>;
  fromAmount?: Maybe<CoinAmount>;
  toAmount?: Maybe<CoinAmount>;
  poolInfo?: Maybe<PoolInfo>;
  txCost?: TransactionCost;
  slippage?: number;
  previewInfo?: Maybe<PreviewInfo>;
};
