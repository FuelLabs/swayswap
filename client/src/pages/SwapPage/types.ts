export enum ActiveInput {
  'from' = 'from',
  'to' = 'to',
}

export type SwapState = {
  from: string;
  to: string;
  direction: ActiveInput;
  amount: bigint | null;
};
