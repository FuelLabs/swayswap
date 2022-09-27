import type Decimal from 'decimal.js';
import type { CoinQuantity, TransactionResult } from 'fuels';
import { bn } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { SwapMachineContext } from '../types';
import { SwapDirection } from '../types';
import {
  calculateMaxBalanceToSwap,
  createAmount,
  hasEnoughBalance,
  hasEthForNetworkFee,
  hasLiquidityForSwap,
  queryNetworkFeeOnSwap,
  queryPreviewAmount,
  swapTokens,
  ZERO_AMOUNT,
} from '../utils';

import { getCoin, getCoinETH, handleError, multiply } from '~/systems/Core';
import { txFeedback } from '~/systems/Core/utils/feedback';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import { emptyTransactionCost, getTransactionCost } from '~/systems/Core/utils/gas';
import { getPoolRatio } from '~/systems/Pool';
import type { Coin, Maybe } from '~/types';
import { Queries } from '~/types';
import type { PoolInfoOutput, PreviewInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export const FROM_TO = SwapDirection.fromTo;
export const TO_FROM = SwapDirection.toFrom;

// ----------------------------------------------------------------------------
// Machine
// ----------------------------------------------------------------------------

type MachineEvents =
  | { type: 'INVERT_COINS' }
  | { type: 'SELECT_COIN'; data: { direction: SwapDirection; coin: Coin } }
  | { type: 'INPUT_CHANGE'; data: { direction: SwapDirection; value: string } }
  | { type: 'SET_MAX_VALUE'; data: { direction: SwapDirection } }
  | { type: 'SET_BALANCES'; data: Maybe<CoinQuantity[]> }
  | { type: 'SWAP' };

type MachineServices = {
  fetchBalances: {
    data: Maybe<CoinQuantity[]>;
  };
  fetchTxCost: {
    data: TransactionCost;
  };
  fetchPoolRatio: {
    data: {
      info: Maybe<PoolInfoOutput>;
      ratio: Maybe<Decimal>;
    };
  };
  fetchPreview: {
    data: Maybe<PreviewInfoOutput>;
  };
  swap: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Maybe<TransactionResult<any>>;
  };
};

const INVALID_STATES = {
  NO_COIN_SELECTED: {
    cond: 'notHasCoinSelected',
    target: '#(machine).invalid.withoutCoinSelected',
  },
  NO_AMOUNT: {
    cond: 'notHasAmount',
    target: '#(machine).invalid.withoutAmount',
  },
  NO_POOL_RATIO: {
    cond: 'notHasPoolRatio',
    target: '#(machine).invalid.withoutPoolRatio',
  },
  NO_COIN_FROM_BALANCE: {
    cond: 'notHasCoinFromBalance',
    target: '#(machine).invalid.withoutCoinFromBalance',
  },
  NO_ETH_FOR_NETWORK_FEE: {
    cond: 'notHasEthForNetworkFee',
    target: '#(machine).invalid.withoutEthForNetworkFee',
  },
  NO_LIQUIDITY: {
    cond: 'noLiquidity',
    target: '#(machine).invalid.withoutLiquidity',
  },
  NO_FROM_LIQUIDITY: {
    cond: 'notHasLiquidity',
    actions: 'cleanPreviewInfo',
    target: '#(machine).invalid.withoutLiquidity',
  },
  FROM_AMOUNT_TOO_LOW: {
    cond: 'toAmountIsZero',
    actions: ['cleanPreviewInfo', 'cleanToAmount'],
    target: '#(machine).invalid.fromAmountTooLow',
  },
};

export const swapMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgDMwAXHAqAIXQBt19M4BiCAe0JIIDcuAazAk0WPIVIVqk+kxZtYCAV0zpKuHgG0ADAF1EoAA5dYuTTyMgAHogCsAZgCMJABzOATPef37ANjcATl1ggBoQAE9ER3sAFhIgpKDPOLdHRwB2N11-AF88iPEaKXIqEvlmVg4wACdarlqSY2ZKMkbUMQwS4jLZWgYqpRV8QXVLfD1DJBBTcwnrOwQXfxJnTKDAt28ff0z-COiET0ddEjjnf2c4oLj7XUzLtwKi7slemQqAJTguAFdako+hUACo2ADCZkonB4olUIi6EgIH3Kch+sH+gLgwLkYMhsEoIzGGi0kwM1jmFlJi0QzlybncbmyTluQTc-iyhwcaRITjicV0ujiqTSTJeIGK72kqNo6MxQM+uIhUPYdQaTRaGnatU6kuR0v6+CgcoBCplRrxUKJahJOnJM0pCxmS3Z9l5bOC9jc9hSws8XIQ-ISukccUcwSuXs8t0y4r1pUVst+pux-CYuAgJKNAEl8MY-pRYOwKWYqVZnbSTo5ef57v4OUF7KkOQH-JsSJlMgLBZ5HgE4299TikxiU7ASDgwJghAAFLhcRjg2pgDSQGG8eGieMow3G5NY8eT6dzhdLleUSDW8akqYl+bUisIS4+EhtkKnAV93T2Vvtzvd3Re18fxdGcAckQTc091HA8J2wKdZ3nRdl1XCBVXqRpmlabVdUHSDdxNWCj0Q08UIvCAr1tMlphMUsnVAJZfBfPw9hOJJO1DH8okQYU3QCTsY3-R5HHAnoDW+fczV3Gdl34XAwAAd3XOFRmELc8J3CSYKkioZLAOTFMoiZbwdOiHwYxBPF0dsMiCfYLhCbtMgDPkSBDMM2VAttLhEwoJQ08S0Uk7FEyNPSDKUtVMM1NoOkRMThyNQidLkcL5IUoyb3tWj73LCyn29IISFDOkrNiO56QDXiawEuJOy7YTRKlRLoPlbFYCoTQjQAQVQf58ELYtTNy-AaWOL0iv5IJw3We4u2uFzAjc0NHHrOJ-DDQUwL87dApHNrxzTRgMyzKAAGUFPQYwhpystRsfS5BVfPYNl43sqwDLxvzWFw7guLwAmcIImqHULWrHZSSAJVd4uasHkrgO87rGk50hIVIrPrDJ-Cs5wA2mzJ0aZDx1nScMhRB0oIDAAAjfrMFodgbGhi8SHQMgL1qZAQN0Ih2F2khqbpv5WFoJH6NsHjprcnJrh9Lsrjs5zuIQJw3Xc8NQzbEn8h2gKSBQiBIhBLgLquvgIEYMB2DOgB1bqZ3F8zJeOOWfvrL07iBzYuKOL6Eg5OX-u8RXKd6Q3jdNy7jCh6PjEZ7gN1UhEBYjk2zZj2A49oTK7Ro2YzLyl3UkuDtcmmkDYh9eJPqszxX1+8N9mjDJPDD0g06j82s6u+OjXQ9UsK1OLU5XI30+j2Pe5z1Rrzzp2i6WTxUY7ZefTDTHvU+6yGUD4UNniXs4nbm2AFEQQAfTobqABluoAOXBU+zoX+78uuFx0dFXIsmcP+gYDL2Ds9YXrrT-o4JIJ8zqnxvqfcEl9wQAHlsz31fmNWs5wQJPGcEyE4Tg8YqyrucZIPgcgnEFPsE+KCABqp8vgIOQffF+w1kaPhxsVWIPlbjenrIBQBpxziXDKk3TI9hHhtz1hBYgZ9L4AFluoAA0L7UNvgAVVPmgx83pzjWQCKBVkOM3BxADPsVYdlAK9lAlZBWVD74zlUQggAEg-AA4holhEslgAFoNro02B-f6mRvC9iqhyXkK1tg4wuCBZ44p8BcGpvAGYAswaDEUIjDxzsl6NmKp4EmECThBgIUcUM9dkj+I8FcMMsTXhSL2klYK44waWgJJo-KRiEgNU8HsH0QpsgHBVk4VYGt0jrTZH-WMkiErw0aSQI6J0upQFzPmQsbSXZeEyGcRs-EQhCi9EExarg+QXCyMKcMdl24tQRoeeCx4kJnlQmsxiTgzibPuI2IJwRNnKyOEM5a1StbjMuJcmZ2kQpQTSopJ5tJ0gMjSLcdaFjsirRcqtf5msxk6xBVBa5UNOq0F6v1VZmTF6WWjGUwIIDvRhiyP6QZaKRmApJpM2p0ycWzPmZmRZGdoXHDbKsRwnhnAQLZF2UCvsHBXHCfyYVXZUYXKmXDdlYLxywD+JgJQSTbqeMskEYV7h9hBJSOyHBhzpUnLlecmp-k6lXMaby7Yry6rdNEY5fpAZYj134h4b0gqmzL0uULemYsSVv2LmyNyYiXBBKqW4FyeTzUhgEjNXyrLmqdwzhbK2vK66rGFR7EM6RDGfSBrvX6dU7irT-sfRVQ4M2Tx7sYPuUAc2pDOG4dkONjW+CriWkIDdrhCpyNsAIEi011rHpHTNy5UkKGqFqguI0UY+gZB6XwU1VpiJLUEgdQZvQ63sJc+tV0c09ndrWQtq08nb28Lu7IP9QJilraUAQ6YIAkAUhYbA-xKCEpFpQXla1irpCVnsTYoQBl+3DHmlwsQIFjOApc19x132fsoN+gskICAADEGioEA8EDsPhfBCN7B4CVT5UgMmFTRnyG1RFIdGG+j9X6f1YfwCbQDSRloY3WIY3wJa6Q-WuN6B4DlD3Pt6MhjMLH0M-pPIwL4tpAO+M1qBjYMTIO0mjcJsj1Lax1UY5y2TGHKA31wAARz+BmCwRxtVZMQEBtTnYwOae3hcYTPhmRYJuEZ5jaHTPsdw1wVAaTqgqfrjg9kNwi3PjpUcOykXy29g5KIu4fmUMmZ-afdD2HGj3yoApRoQhsNgDAIBn0wGIEuY0xB7dRUaN3GXikLITgMsZkA7EKr6nwPsgDMEBrv1RHxD8F2Gt46pC8q8R2vxVSSrrGCT82kdxBFVMCE2B4EDYkFCAA */
  createMachine(
    {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import('./swapMachine.typegen').Typegen0,
      schema: {
        context: {} as SwapMachineContext,
        events: {} as MachineEvents,
        services: {} as MachineServices,
      },
      id: '(machine)',
      initial: 'fetchingBalances',
      states: {
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
          initial: 'fetchingPoolInfo',
          states: {
            idle: {},
            fetchingPoolInfo: {
              invoke: {
                src: 'fetchPoolRatio',
                onDone: [
                  INVALID_STATES.NO_POOL_RATIO,
                  {
                    actions: 'setPoolInfo',
                    target: 'fetchingTxCost',
                  },
                ],
                onError: [
                  {
                    actions: 'toastErrorMessage',
                  },
                ],
              },
            },
            fetchingTxCost: {
              invoke: {
                src: 'fetchTxCost',
                onDone: [
                  {
                    actions: 'setTxCost',
                    target: 'validatingInputs',
                  },
                ],
                onError: [
                  {
                    actions: 'toastErrorMessage',
                  },
                ],
              },
            },
            validatingInputs: {
              always: [
                INVALID_STATES.NO_COIN_SELECTED,
                INVALID_STATES.NO_AMOUNT,
                INVALID_STATES.NO_FROM_LIQUIDITY,
                { target: 'fetchingPreview' },
              ],
            },
            fetchingPreview: {
              invoke: {
                src: 'fetchPreview',
                onDone: [
                  {
                    actions: ['setPreviewInfo', 'setOppositeValue'],
                    target: 'settingAmounts',
                  },
                ],
                onError: [
                  {
                    actions: 'toastErrorMessage',
                  },
                ],
              },
            },
            settingAmounts: {
              entry: 'setValuesWithSlippage',
              always: {
                target: 'validatingSwap',
              },
            },
            validatingSwap: {
              always: [
                INVALID_STATES.NO_COIN_FROM_BALANCE,
                INVALID_STATES.NO_ETH_FOR_NETWORK_FEE,
                INVALID_STATES.FROM_AMOUNT_TOO_LOW,
                INVALID_STATES.NO_LIQUIDITY,
                { target: 'success' },
              ],
            },
            success: {
              type: 'final',
            },
          },
          onDone: {
            target: 'readyToSwap',
          },
        },
        debouncing: {
          tags: 'loading',
          on: {
            INPUT_CHANGE: {
              actions: 'setInputValue',
              target: 'debouncing',
            },
          },
          after: {
            '600': 'fetchingResources',
          },
        },
        readyToSwap: {
          initial: 'idle',
          states: {
            idle: {
              tags: 'canSwap',
              on: {
                SWAP: {
                  target: 'swapping',
                },
              },
            },
            swapping: {
              invoke: {
                src: 'swap',
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
              tags: 'isSwapping',
            },
            success: {
              entry: ['clearContext', 'toastSwapSuccess'],
              always: {
                target: '#(machine).fetchingBalances',
              },
            },
          },
        },
        invalid: {
          states: {
            withoutCoinSelected: {
              tags: 'needSelectToken',
            },
            withoutAmount: {
              tags: 'needEnterAmount',
            },
            withoutPoolRatio: {
              tags: 'noPoolFound',
            },
            withoutLiquidity: {
              tags: 'notHasLiquidity',
            },
            withoutCoinFromBalance: {
              tags: 'notHasCoinFromBalance',
            },
            withoutEthForNetworkFee: {
              tags: 'notHasEthForNetworkFee',
            },
            fromAmountTooLow: {
              tags: 'fromAmountTooLow',
            },
          },
        },
      },
      on: {
        SET_BALANCES: {
          actions: 'setBalances',
        },
        SELECT_COIN: {
          actions: 'selectCoin',
          target: '.fetchingBalances',
        },
        INVERT_COINS: [
          {
            actions: 'clearContext',
            ...INVALID_STATES.NO_COIN_SELECTED,
          },
          {
            actions: 'invertDirection',
            target: '.fetchingBalances',
          },
        ],
        SET_MAX_VALUE: [
          {
            actions: 'setMaxValue',
            ...INVALID_STATES.NO_COIN_SELECTED,
          },
          {
            actions: 'setMaxValue',
            target: '.fetchingResources',
          },
        ],
        INPUT_CHANGE: [
          {
            cond: 'inputIsEmpty',
            target: '.invalid.withoutAmount',
          },
          {
            cond: 'notValueChanged',
          },
          {
            actions: 'setInputValue',
            ...INVALID_STATES.NO_COIN_SELECTED,
          },
          {
            actions: 'setInputValue',
            cond: 'hasCoinsSelected',
            target: '.debouncing',
          },
        ],
      },
    },
    {
      services: {
        fetchBalances: async ({ client }) => {
          return client?.fetchQuery<CoinQuantity[]>(Queries.UserQueryBalances);
        },
        fetchTxCost: async (ctx) => {
          const contractCall = await queryNetworkFeeOnSwap(ctx);
          const txCost = await getTransactionCost(contractCall);
          return txCost || emptyTransactionCost();
        },
        fetchPoolRatio: async (ctx) => {
          if (!ctx.contract) {
            throw new Error('Contract not found');
          }
          const { value: info } = await ctx.contract.functions.get_pool_info().get();
          const ratio = getPoolRatio(info);
          return {
            info,
            ratio,
          };
        },
        fetchPreview: async (ctx) => {
          return queryPreviewAmount(ctx);
        },
        swap: async (ctx) => {
          return swapTokens(ctx);
        },
      },
      actions: {
        cleanPreviewInfo: assign((ctx) => ({
          ...ctx,
          previewInfo: null,
        })),
        cleanToAmount: assign((ctx) => ({
          ...ctx,
          toAmount: undefined,
        })),
        setTxCost: assign({
          txCost: (_, ev) => ev.data,
        }),
        setPoolInfo: assign({
          poolInfo: (_, ev) => ev.data.info,
        }),
        setPreviewInfo: assign({
          previewInfo: (_, ev) => ev.data,
        }),
        setBalances: assign((ctx, ev) => {
          const balances: CoinQuantity[] = ev.data || [];
          const fromId = ctx.coinFrom?.assetId;
          const toId = ctx.coinTo?.assetId;
          const fromBalance = getCoin(balances, fromId);
          const toBalance = getCoin(balances, toId);
          const ethBalance = getCoinETH(balances);
          return {
            coinFromBalance: bn(fromBalance?.amount),
            coinToBalance: bn(toBalance?.amount),
            ethBalance: bn(ethBalance?.amount),
          };
        }),
        selectCoin: assign((ctx, ev) => ({
          ...ctx,
          ...(ev.data.direction === FROM_TO && {
            coinFrom: ev.data.coin,
          }),
          ...(ev.data.direction === TO_FROM && {
            coinTo: ev.data.coin,
          }),
        })),
        invertDirection: assign((ctx) => {
          const isFrom = ctx.direction === FROM_TO;
          return {
            direction: isFrom ? TO_FROM : FROM_TO,
            coinFrom: ctx.coinTo,
            coinTo: ctx.coinFrom,
            fromAmount: ctx.toAmount,
            toAmount: ctx.fromAmount,
          };
        }),
        setInputValue: assign((ctx, ev) => {
          const isFrom = ev.data.direction === FROM_TO;
          const next = createAmount(ev.data.value);
          return {
            ...ctx,
            direction: ev.data.direction,
            ...(isFrom
              ? { fromAmount: next, toAmount: ZERO_AMOUNT }
              : { toAmount: next, fromAmount: ZERO_AMOUNT }),
          };
        }),
        setOppositeValue: assign((ctx, ev) => {
          const isFrom = ctx.direction === FROM_TO;
          const amount = createAmount(ev.data?.amount);
          return {
            ...ctx,
            [isFrom ? 'toAmount' : 'fromAmount']: amount,
          };
        }),
        setMaxValue: assign((ctx, { data: { direction } }) => {
          const isFrom = direction === FROM_TO;
          const amount = calculateMaxBalanceToSwap({ direction, ctx });

          return {
            ...ctx,
            direction,
            ...(isFrom ? { fromAmount: amount } : { toAmount: amount }),
          };
        }),
        setValuesWithSlippage: assign((ctx) => {
          const slippage = ctx.slippage || 0;
          const lessSlippage = multiply(ctx.toAmount?.raw, 1 - slippage);
          const plusSlippage = multiply(ctx.fromAmount?.raw, 1 + slippage);
          const amountLessSlippage = createAmount(lessSlippage);
          const amountPlusSlippage = createAmount(plusSlippage);

          return {
            ...ctx,
            amountLessSlippage,
            amountPlusSlippage,
          };
        }),
        clearContext: assign((ctx) => ({
          ...ctx,
          fromAmount: undefined,
          toAmount: undefined,
          amountLessSlippage: ZERO_AMOUNT,
          amountPlusSlippage: ZERO_AMOUNT,
          poolInfo: null,
          previewInfo: null,
        })),
        /**
         * Notifications actions using toast()
         */
        toastSwapSuccess(_, ev) {
          txFeedback('Swap made successfully!')(ev.data);
        },
        toastErrorMessage(_, ev) {
          handleError(ev.data);
          // eslint-disable-next-line no-console
          console.error(ev.data);
        },
      },
      guards: {
        toAmountIsZero: (ctx) => {
          return bn(ctx.previewInfo?.amount).isZero();
        },
        notHasLiquidity: (ctx) => {
          return !hasLiquidityForSwap(ctx);
        },
        inputIsEmpty: (_, ev) => {
          const val = createAmount(ev.data.value);
          return val.raw.eq(ZERO_AMOUNT.raw);
        },
        notValueChanged: (ctx, ev) => {
          const isFrom = ctx.direction === FROM_TO;
          const next = createAmount(ev.data.value);
          const valueChanged = isFrom
            ? ctx.fromAmount == null || !ctx.fromAmount.raw.eq(next.raw)
            : ctx.toAmount == null || !ctx.toAmount.raw.eq(next.raw);
          return !valueChanged;
        },
        notHasCoinSelected: (ctx) => {
          return !ctx.coinFrom || !ctx.coinTo;
        },
        hasCoinsSelected: (ctx) => {
          return Boolean(ctx.coinFrom && ctx.coinTo);
        },
        notHasAmount: (ctx) => {
          return (
            (ctx.direction === SwapDirection.fromTo && !ctx.fromAmount?.raw) ||
            (ctx.direction === SwapDirection.toFrom && !ctx.toAmount?.raw)
          );
        },
        notHasPoolRatio: (_, ev) => {
          return Boolean(ev.data.ratio?.eq(0));
        },
        noLiquidity: (ctx) => {
          return !ctx.previewInfo?.has_liquidity || !hasLiquidityForSwap(ctx);
        },
        notHasCoinFromBalance: (ctx) => {
          const isFrom = ctx.direction === SwapDirection.fromTo;
          return isFrom
            ? !hasEnoughBalance(ctx.fromAmount?.raw, ctx.coinFromBalance)
            : !hasEnoughBalance(ctx.amountPlusSlippage?.raw, ctx.coinFromBalance);
        },
        notHasEthForNetworkFee: (ctx) => {
          return !hasEthForNetworkFee(ctx);
        },
      },
    }
  );

export type SwapMachine = typeof swapMachine;
export type SwapMachineService = InterpreterFrom<SwapMachine>;
export type SwapMachineState = StateFrom<SwapMachine>;

export function isLoadingState(state: SwapMachineState) {
  return state.hasTag('loading');
}
