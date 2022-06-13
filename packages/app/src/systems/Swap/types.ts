import type { Coin, Maybe } from '~/types';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

export enum ActiveInput {
  'from' = 'from',
  'to' = 'to',
}

export type SwapState = {
  direction: ActiveInput;
  coinFrom: Coin;
  coinTo: Coin;
  amount: Maybe<bigint>;
  amountFrom: Maybe<bigint>;
  hasBalance: boolean;
};

export type SwapInfo = Partial<
  SwapState &
    PoolInfo & {
      previewAmount: Maybe<bigint>;
    }
>;

export enum ValidationStateEnum {
  SelectToken = 0,
  EnterAmount = 1,
  InsufficientBalance = 2,
  InsufficientAmount = 3,
  InsufficientLiquidity = 4,
  InsufficientFeeBalance = 5,
  Swap = 6,
}
