import { safeBigInt } from '../Core';

import type { AddLiquidityMachineState } from './machines/addLiquidityMachine';
import type { AddLiquidityActive } from './types';

export const selectors = {
  createPool: (state: AddLiquidityMachineState) => {
    return state.hasTag('createPool');
  },
  poolShare: ({ context: ctx }: AddLiquidityMachineState) => {
    return ctx.poolShare;
  },
  fromAmount: ({ context: ctx }: AddLiquidityMachineState) => {
    return ctx.fromAmount;
  },
  toAmount: ({ context: ctx }: AddLiquidityMachineState) => {
    return ctx.toAmount;
  },
  coinFrom: ({ context: ctx }: AddLiquidityMachineState) => {
    return ctx.coinFrom;
  },
  coinTo: ({ context: ctx }: AddLiquidityMachineState) => {
    return ctx.coinTo;
  },
  isActiveLoading: (active: AddLiquidityActive) => (state: AddLiquidityMachineState) => {
    return active !== state.context.active && state.hasTag('loading');
  },
  previewAmount: ({ context: ctx }: AddLiquidityMachineState) => {
    return safeBigInt(ctx.liquidityPreview?.liquidityTokens);
  },
  poolInfo: ({ context: ctx }: AddLiquidityMachineState) => {
    return ctx.poolInfo;
  },
  isLoading: (state: AddLiquidityMachineState) => {
    return state.hasTag('loading');
  },
  transactionCost: ({ context: ctx }: AddLiquidityMachineState) => {
    return ctx.transactionCost;
  },
};
