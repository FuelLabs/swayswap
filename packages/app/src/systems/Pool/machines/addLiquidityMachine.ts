import Decimal from 'decimal.js';
import type { BN, CoinQuantity, TransactionResult } from 'fuels';
import { NativeAssetId, bn } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AddLiquidityMachineContext } from '../types';
import { liquidityPreviewEmpty, AddLiquidityActive } from '../types';
import { addLiquidity, fetchPoolInfo, getPoolRatio } from '../utils';

import { CONTRACT_ID } from '~/config';
import { calculatePercentage, getCoin, handleError, TOKENS, ZERO } from '~/systems/Core';
import { txFeedback } from '~/systems/Core/utils/feedback';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import { getTransactionCost } from '~/systems/Core/utils/gas';
import type { Coin, Maybe } from '~/types';
import { Queries } from '~/types';
import type {
  ExchangeContractAbi,
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
  NO_FROM_AMOUNT: {
    cond: 'notHasFromAmount',
    target: '#(AddLiquidityMachine).invalid.withoutFromAmount',
  },
  NO_TO_AMOUNT: {
    cond: 'notHasToAmount',
    target: '#(AddLiquidityMachine).invalid.withoutToAmount',
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
    }
  | {
      type: 'START';
      data: { contract: ExchangeContractAbi };
    };

type MachineServices = {
  fetchBalances: {
    data: Array<CoinQuantity>;
  };
  fetchAddLiquidity: {
    data: Maybe<PreviewAddLiquidityInfoOutput>;
  };
  fetchCreateLiquidity: {
    data: Maybe<PreviewAddLiquidityInfoOutput>;
  };
  fetchPoolInfo: {
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
      predictableActionArguments: true,
      schema: {
        context: {} as AddLiquidityMachineContext,
        events: {} as MachineEvents,
        services: {} as MachineServices,
      },
      id: '(AddLiquidityMachine)',
      initial: 'idle',
      states: {
        idle: {
          on: {
            START: {
              target: 'fetchingBalances',
              actions: ['start'],
            },
          },
        },
        fetchingBalances: {
          invoke: {
            src: 'fetchBalances',
            onDone: [
              {
                actions: 'setBalances',
                target: 'fetchingPoolInfo',
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
        fetchingPoolInfo: {
          tags: 'loading',
          invoke: {
            src: 'fetchPoolInfo',
            onDone: [
              {
                actions: 'setPoolInfo',
                target: 'idle',
              },
            ],
            onError: 'idle',
          },
        },
        debouncing: {
          tags: 'loading',
          after: {
            '600': [
              {
                cond: 'poolHasLiquidity',
                target: 'addLiquidity',
              },
              {
                target: 'createPool',
              },
            ],
          },
          on: {
            INPUT_CHANGE: {
              actions: 'setInputValue',
              target: 'debouncing',
              internal: false,
            },
          },
        },
        createPool: {
          tags: 'createPool',
          initial: 'fetchingCreateLiquidityPreview',
          states: {
            idle: {},
            fetchingCreateLiquidityPreview: {
              tags: 'loading',
              invoke: {
                src: 'fetchCreateLiquidity',
                onDone: {
                  actions: 'setPreviewCreateLiqudity',
                  target: '#(AddLiquidityMachine).validatingInputs',
                },
                onError: 'idle',
              },
            },
            readyToAddLiquidity: {
              tags: 'readyToAddLiquidity',
              on: {
                ADD_LIQUIDITY: {
                  target: '#(AddLiquidityMachine).addingLiquidity',
                },
              },
            },
          },
        },
        addLiquidity: {
          tags: 'addLiquidity',
          initial: 'fetchingAddLiquidityPreview',
          states: {
            idle: {},
            fetchingAddLiquidityPreview: {
              tags: 'loading',
              invoke: {
                src: 'fetchAddLiquidity',
                onDone: {
                  actions: 'setPreviewAddLiqudity',
                  target: '#(AddLiquidityMachine).validatingInputs',
                },
                onError: 'idle',
              },
            },
            readyToAddLiquidity: {
              tags: 'readyToAddLiquidity',
              on: {
                ADD_LIQUIDITY: {
                  target: '#(AddLiquidityMachine).addingLiquidity',
                },
              },
            },
          },
        },
        validatingInputs: {
          always: [
            INVALID_STATES.NO_FROM_AMOUNT,
            INVALID_STATES.NO_TO_AMOUNT,
            INVALID_STATES.NO_FROM_BALANCE,
            INVALID_STATES.NO_TO_BALANCE,
            { target: 'fetchingTransactionCost' },
          ],
        },
        fetchingTransactionCost: {
          initial: 'fetching',
          states: {
            fetching: {
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
                  cond: 'poolHasLiquidity',
                  target: '#(AddLiquidityMachine).addLiquidity.readyToAddLiquidity',
                },
                {
                  target: '#(AddLiquidityMachine).createPool.readyToAddLiquidity',
                },
              ],
            },
          },
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
                target: 'addLiquidity.readyToAddLiquidity',
                actions: 'toastErrorMessage',
              },
            ],
          },
        },
        success: {
          entry: ['toastSwapSuccess', 'clearContext', 'navigateToPoolList'],
          always: {
            target: '#(AddLiquidityMachine).fetchingBalances',
          },
        },
        invalid: {
          states: {
            withoutFromAmount: {
              tags: 'needEnterFromAmount',
            },
            withoutToAmount: {
              tags: 'needEnterToAmount',
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
        fetchCreateLiquidity: async (ctx) => {
          const { contract, coinFrom, fromAmount } = ctx;
          if (!contract) return null;
          if (fromAmount && coinFrom) {
            const { value } = await contract.functions
              .get_add_liquidity(fromAmount, coinFrom.assetId)
              .get();
            return value;
          }
          return null;
        },
        fetchPoolInfo: async (ctx) => {
          return fetchPoolInfo(ctx);
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
            if (!ev.data) return null;
            return ev.data;
          },
          poolRatio: (_, ev) => {
            return getPoolRatio(ev.data);
          },
          poolShare: (ctx, ev) => {
            const poolPosition = bn(ctx.poolPosition);
            if (!ev.data || bn(poolPosition).isZero()) return new Decimal(0);
            return calculatePercentage(poolPosition, ev.data.lp_token_supply);
          },
        }),
        setBalances: assign({
          balances: (_, ev) => ev.data,
          poolPosition: (_, ev) => {
            return bn(getCoin(ev.data, CONTRACT_ID)?.amount);
          },
        }),
        setPreviewAddLiqudity: assign((ctx, ev) => {
          if (!ev.data) {
            return {
              ...ctx,
              fromAmount: null,
              toAmount: null,
              liquidityPreview: liquidityPreviewEmpty,
            };
          }

          const currentLPTokensBalance = bn(ctx.poolPosition);
          const totalLPTokens = ev.data.lp_token_received.add(currentLPTokensBalance);
          const lpTokenSupply = bn(ctx.poolInfo?.lp_token_supply);
          const finalContext: AddLiquidityMachineContext = {
            ...ctx,
            poolShare: calculatePercentage(totalLPTokens, lpTokenSupply),
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
        setPreviewCreateLiqudity: assign((ctx, ev) => {
          if (!ev.data || bn(ctx.fromAmount).isZero() || bn(ctx.toAmount).isZero()) {
            return {
              ...ctx,
              poolShare: new Decimal(100),
              liquidityPreview: liquidityPreviewEmpty,
            };
          }

          return {
            ...ctx,
            poolRatio: calculatePercentage(ctx.fromAmount!, ctx.toAmount!).div(100),
            poolShare: new Decimal(100),
            liquidityPreview: {
              liquidityTokens: ev.data.lp_token_received,
              requiredAmount: ZERO,
            },
          };
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
              coinFrom: coin,
              fromAmount: amount,
            };
          }
          return {
            ...ctx,
            active: AddLiquidityActive.to,
            coinTo: coin,
            toAmount: amount,
          };
        }),
        start: assign({
          contract: (_, ev) => ev.data.contract,
        }),
        toastSwapSuccess(_, ev) {
          txFeedback('Add made successfully!')(ev.data.transactionResult);
        },
        toastErrorMessage(_, ev) {
          handleError(ev.data);
          // eslint-disable-next-line no-console
          console.error(ev.data);
        },
        navigateToPoolList: (ctx) => {
          ctx.navigate('/pool/list');
        },
      },
      guards: {
        isInvalidTransaction: (ctx) => {
          return !!ctx.transactionCost?.error;
        },
        notHasEthForNetworkFee: (ctx) => {
          const networkFee = bn(ctx.transactionCost?.fee);
          const ethBalance =
            ctx.balances.find((balance) => balance.assetId === NativeAssetId)?.amount || bn(0);
          return ethBalance.lte(networkFee);
        },
        notHasFromAmount: (ctx) => {
          return !ctx.fromAmount || bn(ctx.fromAmount).isZero();
        },
        notHasToAmount: (ctx) => {
          return !ctx.toAmount || bn(ctx.toAmount).isZero();
        },
        notHasFromBalance: (ctx) => {
          const balanceFrom = bn(getCoin(ctx.balances, ctx.coinFrom.assetId)?.amount);
          return balanceFrom.lt(bn(ctx.fromAmount));
        },
        notHasToBalance: (ctx) => {
          const balanceTo = bn(getCoin(ctx.balances, ctx.coinTo.assetId)?.amount);
          return balanceTo.lt(bn(ctx.toAmount));
        },
        poolHasLiquidity: (ctx) => {
          return !bn(ctx.poolInfo?.lp_token_supply).isZero();
        },
      },
    }
  );

export type AddLiquidityMachine = typeof addLiquidityMachine;
export type AddLiquidityMachineService = InterpreterFrom<AddLiquidityMachine>;
export type AddLiquidityMachineState = StateFrom<AddLiquidityMachine>;
