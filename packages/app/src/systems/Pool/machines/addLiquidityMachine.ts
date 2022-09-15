import Decimal from 'decimal.js';
import type { BN, CoinQuantity, TransactionResult } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AddLiquidityMachineContext } from '../types';
import { poolInfoEmpty, liquidityPreviewEmpty, AddLiquidityActive } from '../types';
import { addLiquidity } from '../utils';

import { getCoin, getCoinETH, handleError, isZero, safeBigInt, TOKENS } from '~/systems/Core';
import { txFeedback } from '~/systems/Core/utils/feedback';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import { getTransactionCost } from '~/systems/Core/utils/gas';
import type { Coin, Maybe } from '~/types';
import { Queries } from '~/types';
import type {
  PoolInfoOutput,
  PreviewAddLiquidityInfoOutput,
} from '~/types/contracts/ExchangeContractAbi';

const INVALID_STATES = {
  NO_FROM_BALANCE: {
    cond: 'notHasFromBalance',
    target: '#(AddLiquidityMachine).invalid.withoutFromBalance',
  },
  NO_TO_BALANCE: {
    cond: 'notHasToBalance',
    target: '#(AddLiquidityMachine).invalid.withoutToBalance',
  },
  NO_AMOUNT: {
    cond: 'notHasAmount',
    target: '#(AddLiquidityMachine).invalid.withoutAmount',
  },
  NO_ETH_FOR_NETWORK_FEE: {
    cond: 'notHasEthForNetworkFee',
    target: '#(AddLiquidityMachine).invalid.withoutEthForNetworkFee',
  },
  INVALID_TRANSACTION: {
    cond: 'isInvalidTransaction',
    target: '#(AddLiquidityMachine).invalid.invalidTransaction',
  },
};

type MachineEvents =
  | {
      type: 'INPUT_CHANGE';
      data: { amount: Maybe<BN>; coin: Maybe<Coin>; active: AddLiquidityActive };
    }
  | {
      type: 'SET_BALANCES';
      data: CoinQuantity[];
    }
  | {
      type: 'ADD_LIQUIDITY';
    };

type MachineServices = {
  fetchBalances: {
    data: Array<CoinQuantity>;
  };
  fetchAddLiquidity: {
    data: Maybe<PreviewAddLiquidityInfoOutput>;
  };
  fetchResources: {
    data: Maybe<PoolInfoOutput>;
  };
  fetchTransactionCost: {
    data: Maybe<TransactionCost>;
  };
  addLiquidity: {
    data: {
      amount: BN;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transactionResult: TransactionResult<any>;
    };
  };
};

export const addLiquidityMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOnQggBlcBHAV1wlwBcBPAWSz0JIjACMA9nXyYCUAMQBJAHIAFAKoAVAPoBhABIBBGQHEAoolAAHQbBa5B+IyAAeiAEwAGAGwkArAGYAjA-cAaEFZEAA4AThIwqOiXBwcXdwB2ABYXAF80wLQuAmIyCmp6RhYOHJ4+IRExfElbWGZ0ZjAyADMmgCdkFycnIglsnFzScipaBiY2TkHygWFRcRtTc2ZLayQ7RE9E7xJXP0DghG8QxJJk6LDurbCnT08HDKyMabyRwvGSqe4waXlldW0ekM6yWFisNnsCGSDgOiG87gi3hcyMS2xcYU8LhSngymRA+EEfHg6wG32GBTGxUmZWaFTm1SgizMYLWoEhDm8iJO7iciXcqRCPJOsKOIR2FxuxxuGLCjxApKG+VGRQmpReJBaYGY0ygACU4MJ2pg4EzlqsIYh3HFIl5fIkXMlvJ4wqiRcdxRcnFKnDK5QrCOTlR9qS9TSyLaKRelcUA */
  createMachine(
    {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import('./addLiquidityMachine.typegen').Typegen0,
      schema: {
        context: {} as AddLiquidityMachineContext,
        events: {} as MachineEvents,
        services: {} as MachineServices,
      },
      id: '(AddLiquidityMachine)',
      initial: 'fetchingBalances',
      states: {
        idle: {},
        fetchingBalances: {
          invoke: {
            src: 'fetchBalances',
            onDone: [
              {
                actions: 'setBalances',
                target: 'fetchingResources',
              },
            ],
            onError: [
              {
                actions: 'toastErrorMessage',
              },
            ],
          },
          tags: 'loadingBalance',
        },
        fetchingResources: {
          tags: 'loading',
          invoke: {
            src: 'fetchResources',
            onDone: [
              {
                actions: 'setPoolInfo',
                target: 'validatingInputs',
              },
            ],
            onError: 'idle',
          },
        },
        debouncing: {
          tags: 'loading',
          after: {
            '600': {
              target: 'fetchingAddLiquidityPreview',
            },
          },
          on: {
            INPUT_CHANGE: {
              actions: 'setInputValue',
              target: 'debouncing',
              internal: false,
            },
          },
        },
        fetchingAddLiquidityPreview: {
          tags: 'loading',
          invoke: {
            src: 'fetchAddLiquidity',
            onDone: [
              {
                actions: 'setPreviewAddLiqudity',
                target: 'validatingInputs',
              },
            ],
            onError: 'idle',
          },
        },
        validatingInputs: {
          always: [
            INVALID_STATES.NO_AMOUNT,
            INVALID_STATES.NO_FROM_BALANCE,
            INVALID_STATES.NO_TO_BALANCE,
            { target: 'fetchingTransactionCost' },
          ],
        },
        fetchingTransactionCost: {
          initial: 'initial',
          states: {
            initial: {
              tags: 'loading',
              invoke: {
                src: 'fetchTransactionCost',
                onDone: {
                  actions: 'setTransactionCost',
                  target: 'success',
                },
              },
            },
            success: {
              always: [
                INVALID_STATES.NO_ETH_FOR_NETWORK_FEE,
                INVALID_STATES.INVALID_TRANSACTION,
                {
                  target: '#(AddLiquidityMachine).readyToAddLiquidity',
                },
              ],
            },
          },
        },
        readyToAddLiquidity: {
          initial: 'initial',
          states: {
            initial: {
              always: [
                {
                  cond: 'poolHasLiquidity',
                  target: 'addLiquidity',
                },
                {
                  cond: 'poolZeroLiqudity',
                  target: 'createPool',
                },
              ],
            },
            createPool: {
              tags: 'createPool',
            },
            addLiquidity: {
              tags: 'addLiquidity',
            },
            addingLiquidity: {
              tags: 'isAddingLiquidity',
              invoke: {
                src: 'addLiquidity',
                onDone: [
                  {
                    target: 'success',
                  },
                ],
                onError: [
                  {
                    actions: 'toastErrorMessage',
                  },
                ],
              },
            },
            success: {
              entry: ['toastSwapSuccess', 'clearContext'],
              always: {
                target: '#(AddLiquidityMachine).fetchingBalances',
              },
            },
          },
          on: {
            ADD_LIQUIDITY: {
              target: '.addingLiquidity',
            },
          },
        },
        invalid: {
          states: {
            withoutAmount: {
              tags: 'needEnterAmount',
            },
            withoutFromBalance: {
              tags: 'notHasFromBalance',
            },
            withoutToBalance: {
              tags: 'notHasToBalance',
            },
            withoutEthForNetworkFee: {
              tags: 'notHasEthForNetworkFee',
            },
            invalidTransaction: {
              tags: 'isInvalidTransaction',
            },
          },
        },
      },
      on: {
        INPUT_CHANGE: {
          actions: 'setInputValue',
          target: '.debouncing',
        },
        SET_BALANCES: {
          actions: 'setBalances',
        },
      },
    },
    {
      services: {
        fetchBalances: async ({ client }) => {
          return client.fetchQuery<CoinQuantity[]>(Queries.UserQueryBalances);
        },
        addLiquidity: async (ctx) => {
          const { contract, fromAmount, toAmount, coinFrom, coinTo, transactionCost } = ctx;
          if (!contract || !fromAmount || !toAmount || !transactionCost) {
            throw new Error('Missing parameters');
          }
          const addLiquidityCall = await addLiquidity(
            contract,
            fromAmount,
            toAmount,
            coinFrom,
            coinTo,
            transactionCost.total
          );
          const { value, transactionResult } = await addLiquidityCall.call<[void, void, BN]>();
          return {
            amount: value[2],
            transactionResult,
          };
        },
        fetchTransactionCost: async (ctx) => {
          const { contract, fromAmount, toAmount, coinFrom, coinTo } = ctx;
          if (!contract || !fromAmount || !toAmount) return null;
          const addLiquidityCall = await addLiquidity(
            contract,
            fromAmount,
            toAmount,
            coinFrom,
            coinTo
          );
          const txCost = await getTransactionCost(addLiquidityCall);
          return txCost;
        },
        fetchAddLiquidity: async (ctx) => {
          const { contract, coinFrom, coinTo, fromAmount, toAmount, active } = ctx;
          if (!contract) return null;
          if (active === AddLiquidityActive.from && fromAmount && coinFrom) {
            const { value } = await contract.functions
              .get_add_liquidity(fromAmount, coinFrom.assetId)
              .get();
            return value;
          }
          if (toAmount && coinTo) {
            const { value } = await contract.functions
              .get_add_liquidity(toAmount, coinTo.assetId)
              .get();
            return value;
          }
          return null;
        },
        fetchResources: async (ctx) => {
          const { contract, wallet } = ctx;
          if (!contract || !wallet) return null;
          const { value } = await contract.functions.get_pool_info().get();
          return value;
        },
      },
      actions: {
        clearContext: assign((ctx) => ({
          ...ctx,
          transactionCost: null,
          fromAmount: null,
          toAmount: null,
          active: null,
        })),
        setTransactionCost: assign({
          transactionCost: (_, ev) => ev.data,
        }),
        setPoolInfo: assign({
          poolInfo: (_, ev) => {
            if (!ev.data) return poolInfoEmpty;
            return ev.data;
          },
        }),
        setBalances: assign({
          balances: (_, ev) => ev.data,
        }),
        setPreviewAddLiqudity: assign((ctx, ev) => {
          if (!ev.data) {
            return {
              ...ctx,
              fromAmount: null,
              toAmount: null,
              poolShare: new Decimal(0),
              liquidityPreview: liquidityPreviewEmpty,
            };
          }

          const finalContext: AddLiquidityMachineContext = {
            ...ctx,
            poolShare: new Decimal(ev.data.lp_token_received.toHex())
              .div(ev.data.lp_token_received.add(ctx.poolInfo.lp_token_supply).toHex())
              .mul(100),
            liquidityPreview: {
              liquidityTokens: ev.data.lp_token_received,
              requiredAmount: ev.data.token_amount,
            },
          };

          if (ctx.active === AddLiquidityActive.from) {
            finalContext.toAmount = finalContext.liquidityPreview.requiredAmount;
          } else {
            finalContext.fromAmount = finalContext.liquidityPreview.requiredAmount;
          }

          return finalContext;
        }),
        setInputValue: assign((ctx, ev) => {
          const { coin, amount, active } = ev.data;
          if (!coin || !active) {
            return {
              ...ctx,
              liquidityPreview: liquidityPreviewEmpty,
              active: null,
              fromAmount: null,
              toAmount: null,
            };
          }
          if (coin.assetId === TOKENS[0].assetId) {
            return {
              ...ctx,
              active: AddLiquidityActive.from,
              toAmount: null,
              coinFrom: coin,
              fromAmount: amount,
            };
          }
          return {
            ...ctx,
            active: AddLiquidityActive.to,
            fromAmount: null,
            coinTo: coin,
            toAmount: amount,
          };
        }),
        toastSwapSuccess(_, ev) {
          txFeedback('Add made successfully!')(ev.data.transactionResult);
        },
        toastErrorMessage(_, ev) {
          handleError(ev.data);
          // eslint-disable-next-line no-console
          console.error(ev.data);
        },
      },
      guards: {
        isInvalidTransaction: (ctx) => {
          return !!ctx.transactionCost?.error;
        },
        notHasEthForNetworkFee: (ctx) => {
          const fromAmount = safeBigInt(ctx.fromAmount);
          const ethBalance = safeBigInt(getCoinETH(ctx.balances)?.amount);
          const networkFee = safeBigInt(ctx.transactionCost?.fee);
          return ethBalance.lte(fromAmount.add(networkFee));
        },
        notHasAmount: (ctx) => {
          return !ctx.fromAmount || !ctx.toAmount || isZero(ctx.toAmount) || isZero(ctx.fromAmount);
        },
        notHasFromBalance: (ctx) => {
          const balanceFrom = safeBigInt(getCoin(ctx.balances, ctx.coinFrom.assetId)?.amount);
          return balanceFrom.lt(safeBigInt(ctx.fromAmount));
        },
        notHasToBalance: (ctx) => {
          const balanceTo = safeBigInt(getCoin(ctx.balances, ctx.coinTo.assetId)?.amount);
          return balanceTo.lt(safeBigInt(ctx.toAmount));
        },
        poolHasLiquidity: (ctx) => {
          return !isZero(ctx.poolInfo.lp_token_supply);
        },
        poolZeroLiqudity: (ctx) => {
          return isZero(ctx.poolInfo.lp_token_supply);
        },
      },
    }
  );

export type AddLiquidityMachine = typeof addLiquidityMachine;
export type AddLiquidityMachineService = InterpreterFrom<AddLiquidityMachine>;
export type AddLiquidityMachineState = StateFrom<AddLiquidityMachine>;
