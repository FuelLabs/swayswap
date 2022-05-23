import type { Coin } from '~/types';

export enum ActiveInput {
  'from' = 'from',
  'to' = 'to',
}

export type SwapState = {
  from: string;
  to: string;
  direction: ActiveInput;
  coin: Coin;
  amount: bigint | null;
  hasBalance: boolean;
};
