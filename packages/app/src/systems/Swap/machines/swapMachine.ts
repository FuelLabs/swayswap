/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CoinQuantity } from 'fuels';
import toast from 'react-hot-toast';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';

import type { SwapMachineContext } from '../types';
import { SwapDirection } from '../types';
import {
  createAmount,
  hasEthForNetworkFee,
  notHasEnoughBalance,
  notHasLiquidityForSwap,
  queryNetworkFeeOnSwap,
  queryPreviewAmount,
  swapTokens,
  ZERO_AMOUNT,
} from '../utils';

import { isCoinEth, parseInputValueBigInt, toNumber, ZERO } from '~/systems/Core';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import { emptyTransactionCost, getTransactionCost } from '~/systems/Core/utils/gas';
import { getPoolRatio } from '~/systems/Pool';
import { Coin, Maybe, Queries } from '~/types';
import type { PoolInfo, PreviewInfo } from '~/types/contracts/ExchangeContractAbi';

export const FROM_TO = SwapDirection.fromTo;
export const TO_FROM = SwapDirection.toFrom;

// ----------------------------------------------------------------------------
// Machine
// ----------------------------------------------------------------------------

type MachineEvents =
  | { type: 'INVERT_COINS' }
  | { type: 'SELECT_COIN'; data: { direction: SwapDirection; coin: Coin } }
  | { type: 'SET_INPUT_VALUE'; data: { direction: SwapDirection; value: string } }
  | { type: 'SET_MAX_VALUE'; data: { direction: SwapDirection } }
  | { type: 'SET_BALANCES'; data: Maybe<CoinQuantity[]> }
  | { type: 'SWAP' };

type MachineServices = {
  fetchTxCost: {
    data: TransactionCost;
  };
  fetchPoolRatio: {
    data: {
      info: Maybe<PoolInfo>;
      ratio: Maybe<number>;
    };
  };
  fetchPreview: {
    data: Maybe<PreviewInfo>;
  };
  swap: {
    data: Maybe<bigint>;
  };
  refetchBalances: {
    data: void;
  };
};

export const swapMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwO4EMAOA6AZmALgMYAWAlgHZQBKcA9gK4BOhcuBJFUAQmgDZrkWsAMQRa5MFgoA3WgGtJqTGyJlKNWA2as8qzj36C4CGbUJp8pcQG0ADAF1EoDLVilL4pyAAeiAMwA7ACMWEG2gQAsAKwRAJwATLax0QA0IACeiPEAHBFYMbZRUQHZfrYAbLG5AL7VaUrYuhzqdExCKs1QACreAMKu+KLikqYKWA0datSt2rCTnD39sPgm5LLmHuR2jkggLm6bXr4IAbFRoUGxfqWVAVGxtkFpmQg5eQVFJWWVNXUgE00photO0SGBCHIAAq0Wi8XqMMAWSBDCRSNbyRToRrsIEzUHEcFQmFwhFIiCrdYWKxbBxefbualHRBBeLxELlPxRR4BCI8iJBPwRZ5ZAK2LC2CKFbJBLl+WLlCLZcq1epY+YtTRtOAoxT4JHjNWAzjArXwXb0w67Y6nWKhWKxGVVeL3CKpDKICJ+EJhAI5cqigVJALKv4TdAMygAQQAtgxyPgsGCIZxhHTXAzPFbEFFyuKAgHAuUZUk-OVhQhpQFQrZ4n45XXAjmIir-mrw5Yo7H6PGsBAwAAjOOEFPeZb6tA4fBgRgACnKtlsAEphGG0BGoDG4wm+4Pu8PKGmDoyswgvfEsNkHbZTuEIpU2eWgizz6zinLLl6ooEW6v15vuwmRqUJCCLSKQYAoDqaKyGMv4dhuXY9kBUAgWAYEQRSZhUjYtLmumlqgNaRShKcPJslET41o+tjZNkWDxJU0Qyl+5TOj+bZrvB-49kmcgGAIQiRuQEAADKkAAjvQpAQO46SpnhR6ZoRzLhLaCTBrW8QlDWsTlpW1asva15lPazahhxf6IYMADKACiXQAPoAJIAHKQgAqo5ABqkYie5tmHhm5BMq8NH0eUl5xEqWk1gE5b3LmCqXokzp1g6sTsco7acNxNn2Q5ACykYABoOT5fkBQpQUhYqWDlDmsTBM6MSSs6Qrugg9xVq6gpKtkhQBNcfiZRgwiuV5tlUI5vQAPKudZgUET4iDZDmWD2jkpaVA8m3loNWB3jRUSrcd-JnPEI3CHZIm2b001zS5i3HspCCMReMqsZF5T+lpe1+Ad86rSduSXFEF0tuQtB9mayCGjixp4jo8OUPxRgw3s+HPctCACnkRZXINTXJD85ZaeeHxxPmq3fY1I3qtMmqzPTiwDE9SnY2+F6rQurWDV+2Sk76+SSmD8qKrWNx08hJpM7x0KwvCiJThAbPBSeTp1VyCoLsd+btS8ZPC4U200ZeOZS8jDMgqwsD0IQQjoxaWPHEEEQMetQSfZ7d7e7pHXxFU4oi27q2BGlZmqso0uI47mPsy7YR1R+hMssTVSPo1QcRRR1wS1c2R09lnZbomBLJgeVVLS7SRYHy8RxA8BTZPEf25jKvI0WycTg5H2BFwhJc7kOnCqyF9p1Tz14CkEpz14+T7nKKFRnH4bUxMN5lZZxOVWVgKDuMQDD4Llo8noK5yujy9xFJy0Q8uW8qJYUd7JHWhQ5IX2-FwBe8H0f-QUAAGKMFoNGU+L06x0SuJcWirFfS1iiHpViE8YgBxno1MIGVN59y-gPH++98CH3oPgAB5Aui0HAdjXq9FXxVCqEWIIl4H6uxQbyCK-JHilk-pZEuyFULoRQJQ44io8jOm+jpQItYaLUQeBcDkOdBSCgCNwriu9eKo0EsJMSklpKySEYgUUtoigzzrMGVi0R9YrUTvOVBnCtq8hUTvEuBCiH4G0VJGS+AXjODjmrF6Ap5T0WuDPCiCpnQByQeeGx-IybFHCMo7Be9cG5V-oQ-+tAgEgOjBosA+icZynOLeB0WlSxFFYswvGz9gwg04SGXuSSeH4L-sQ0h5Ccl5NdhKLAq8igB39KKFqD9vqsOCaKT0DpHHfx4gIayWIOlnQvA6IaNFFT9T8PPGUtcFyVC-GvT0ky8HxjyfXTWtwWRFFdDWGI8Unya1CRFGmAcogjTyWKeqZzmqXLausjqABaW5uzIrN36iHe0tRahAA */
  createMachine(
    {
      tsTypes: {} as import('./swapMachine.typegen').Typegen0,
      schema: {
        context: {} as SwapMachineContext,
        events: {} as MachineEvents,
        services: {} as MachineServices,
      },
      initial: 'fetchingResources',
      states: {
        debouncing: {
          tags: 'loading',
          after: {
            1000: {
              target: 'fetchingResources',
            },
          },
        },
        fetchingResources: {
          tags: 'loading',
          initial: 'fetchingTxCost',
          states: {
            fetchingTxCost: {
              invoke: {
                src: 'fetchTxCost',
                onDone: [
                  {
                    actions: 'setTxCost',
                    target: 'checkPoolCreated',
                  },
                ],
              },
            },
            checkPoolCreated: {
              invoke: {
                src: 'fetchPoolRatio',
                onDone: [
                  {
                    actions: ['setPoolInfo', 'setPoolRatio'],
                    target: 'success',
                  },
                ],
              },
            },
            success: {
              type: 'final',
            },
          },
          onDone: {
            target: 'checking',
          },
        },
        checking: {
          always: [
            {
              cond: 'notHasAmount',
              target: 'withoutAmount',
            },
            {
              cond: 'notHasCoinFrom',
              target: 'withoutCoinFrom',
            },
            {
              cond: 'notHasCoinTo',
              target: 'withoutCoinTo',
            },
            {
              target: 'preparingToSwap',
            },
          ],
        },
        waitingBalances: {
          tags: 'loading',
        },
        withoutCoinFrom: {
          tags: 'needSelectToken',
        },
        withoutCoinTo: {
          tags: 'needSelectToken',
        },
        withoutAmount: {
          tags: 'needEnterAmount',
        },
        preparingToSwap: {
          initial: 'fetchingPreview',
          states: {
            fetchingPreview: {
              invoke: {
                src: 'fetchPreview',
                onDone: [
                  {
                    actions: ['setPreviewInfo', 'setOppositeValue'],
                    target: 'checking',
                  },
                ],
              },
              tags: 'loading',
            },
            checking: {
              entry: ['setValuesWithSlippage'],
              always: [
                {
                  cond: 'noLiquidity',
                  target: 'withoutLiquidity',
                },
                {
                  cond: 'notHasCoinFromBalance',
                  target: 'withoutCoinFromBalance',
                },
                {
                  cond: 'notHasEthForNetworkFee',
                  target: 'withoutEthForNetworkFee',
                },
                {
                  target: 'canSwap',
                },
              ],
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
            canSwap: {
              tags: 'canSwap',
              on: {
                SWAP: {
                  target: 'swapping',
                },
              },
            },
            swapping: {
              tags: 'loading',
              invoke: {
                src: 'swap',
                onDone: {
                  target: 'success',
                },
              },
            },
            success: {
              tags: 'swapSuccess',
              type: 'final',
              entry: () => {
                toast.success('Swap made succesfully!');
              },
            },
          },
          onDone: {
            actions: ['clearContext'],
            target: 'updateBalances',
          },
        },
        updateBalances: {
          tags: 'loading',
          invoke: {
            src: 'refetchBalances',
            onDone: {
              target: 'fetchingResources',
            },
          },
        },
      },
      on: {
        INVERT_COINS: {
          actions: 'invertDirection',
          target: '.fetchingResources',
        },
        SELECT_COIN: {
          actions: 'selectCoin',
          target: '.fetchingResources',
        },
        SET_BALANCES: {
          actions: ['setBalances'],
          target: '.updateBalances',
        },
        SET_MAX_VALUE: {
          actions: 'setMaxValue',
          target: '.fetchingResources',
          internal: false,
        },
        SET_INPUT_VALUE: [
          {
            actions: 'setInputValue',
            target: '.debouncing',
            cond: 'inputIsNotEmpty',
          },
          {
            actions: 'clearContext',
            target: '.withoutAmount',
          },
        ],
      },
    },
    {
      services: {
        fetchTxCost: async (ctx) => {
          if (!ctx.contract) {
            throw new Error('Contract not found');
          }
          const networkFee = queryNetworkFeeOnSwap(ctx.contract, ctx.direction);
          const txCost = getTransactionCost(networkFee);
          return txCost || emptyTransactionCost();
        },
        fetchPoolRatio: async (ctx) => {
          if (!ctx.contract) {
            throw new Error('Contract not found');
          }
          const info = await ctx.contract?.dryRun.get_pool_info();
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
        refetchBalances: async (ctx) => {
          return ctx.client?.refetchQueries(Queries.UserQueryBalances);
        },
      },
      actions: {
        setBalances: assign((ctx, ev) => {
          const balances = ev.data || [];
          const fromId = ctx.coinFrom?.assetId;
          const toId = ctx.coinTo?.assetId;
          const fromBalance = balances.find((c) => c.assetId === fromId);
          const toBalance = balances.find((c) => c.assetId === toId);
          const ethBalance = balances.find(isCoinEth);
          return {
            coinFromBalance: fromBalance?.amount || ZERO,
            coinToBalance: toBalance?.amount || ZERO,
            ethBalance: ethBalance?.amount || ZERO,
          };
        }),
        setTxCost: assign({
          txCost: (_, ev) => ev.data as TransactionCost,
        }),
        setPoolInfo: assign({
          poolInfo: (_, ev) => ev.data.info,
        }),
        setPoolRatio: assign({
          poolRatio: (_, ev) => ev.data.ratio,
        }),
        setPreviewInfo: assign({
          previewInfo: (_, ev) => ev.data,
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
            ...(isFrom
              ? { fromAmount: next, toAmount: ZERO_AMOUNT }
              : { toAmount: next, fromAmount: ZERO_AMOUNT }),
            direction: ev.data.direction,
          };
        }),
        setOppositeValue: assign((ctx, ev) => {
          const isFrom = ctx.direction === FROM_TO;
          const amount = createAmount(ev.data?.amount);
          return {
            ...ctx,
            ...(isFrom ? { toAmount: amount } : { fromAmount: amount }),
          };
        }),
        setMaxValue: assign((ctx, { data: { direction } }) => {
          const isFrom = direction === FROM_TO;
          const balance = (isFrom ? ctx.coinFromBalance : ctx.coinToBalance) || ZERO;
          const networkFee = ctx.txCost?.total || ZERO;
          const nextValue = balance > ZERO ? balance - networkFee : balance;
          const amount = createAmount(nextValue);

          return {
            ...ctx,
            ...(isFrom
              ? { fromAmount: amount, toAmount: ZERO_AMOUNT }
              : { toAmount: amount, fromAmount: ZERO_AMOUNT }),
            direction,
          };
        }),
        setValuesWithSlippage: assign((ctx) => {
          const slippage = ctx.slippage || 0;
          const amountLessSlippage = createAmount(toNumber(ctx.toAmount?.raw) * (1 - slippage));
          const amountPlusSlippage = createAmount(toNumber(ctx.fromAmount?.raw) * (1 + slippage));

          return {
            ...ctx,
            amountLessSlippage,
            amountPlusSlippage,
          };
        }),
        clearContext: assign((ctx) => ({
          ...ctx,
          fromAmount: ZERO_AMOUNT,
          toAmount: ZERO_AMOUNT,
          amountLessSlippage: ZERO_AMOUNT,
          amountPlusSlippage: ZERO_AMOUNT,
          previewInfo: null,
        })),
      },
      guards: {
        inputIsNotEmpty: (_, ev) => {
          return parseInputValueBigInt(ev.data?.value) > 0;
        },
        notHasAmount: (ctx) => {
          return (
            (ctx.direction === SwapDirection.fromTo && !ctx.fromAmount?.raw) ||
            (ctx.direction === SwapDirection.toFrom && !ctx.toAmount?.raw)
          );
        },
        notHasCoinFrom: (ctx) => !ctx.coinFrom,
        notHasCoinTo: (ctx) => !ctx.coinTo,
        noLiquidity: (ctx) => {
          return !ctx.previewInfo?.has_liquidity || notHasLiquidityForSwap(ctx);
        },
        notHasCoinFromBalance: (ctx) => {
          // console.log(ctx);
          const isFrom = ctx.direction === SwapDirection.fromTo;
          return isFrom
            ? notHasEnoughBalance(ctx.fromAmount?.raw, ctx.coinFromBalance)
            : notHasEnoughBalance(ctx.amountPlusSlippage?.raw, ctx.coinFromBalance);
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
