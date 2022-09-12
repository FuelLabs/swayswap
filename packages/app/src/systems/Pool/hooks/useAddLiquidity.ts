import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { PoolQueries } from '../utils';

import { useUserPositions } from './useUserPositions';

import type { UseCoinInput } from '~/systems/Core';
import { useTransactionCost, getDeadline, useContract } from '~/systems/Core';
import { txFeedback } from '~/systems/Core/utils/feedback';
import { getOverrides } from '~/systems/Core/utils/gas';
import type { Coin } from '~/types';

export interface UseAddLiquidityProps {
  fromInput: UseCoinInput;
  toInput: UseCoinInput;
  coinFrom: Coin;
  coinTo: Coin;
  onSettle?: () => void;
}

export function useAddLiquidity({
  fromInput,
  toInput,
  coinFrom,
  coinTo,
  onSettle,
}: UseAddLiquidityProps) {
  const contract = useContract()!;
  const navigate = useNavigate();
  const { poolRatio } = useUserPositions();
  const successMsg = poolRatio ? 'Added liquidity to the pool.' : 'New pool created.';

  const txCost = useTransactionCost(
    [PoolQueries.AddLiquidityNetworkFee, fromInput.amount, toInput.amount],
    async () => {
      const deadline = await getDeadline(contract);
      return contract
        .multiCall([
          contract.functions.deposit().callParams({
            forward: [fromInput.amount || 2, coinFrom.assetId],
          }),
          contract.functions.deposit().callParams({
            forward: [toInput.amount || 2, coinTo.assetId],
          }),
          contract.functions.add_liquidity(1, deadline),
        ])
        .txParams({
          gasPrice: 0,
          variableOutputs: 2,
        });
    }
  );

  useEffect(() => {
    fromInput.setGasFee(txCost.fee);
  }, [txCost.fee.toHex()]);

  const mutation = useMutation(
    async () => {
      const fromAmount = fromInput.amount;
      const toAmount = toInput.amount;
      if (!fromAmount || !toAmount) return;

      if (!contract) {
        throw new Error('Contract not found');
      }

      const deadline = await getDeadline(contract);
      const { transactionResult } = await contract
        .multiCall([
          contract.functions.deposit().callParams({
            forward: [fromAmount, coinFrom.assetId],
          }),
          contract.functions.deposit().callParams({
            forward: [toAmount, coinTo.assetId],
          }),
          contract.functions.add_liquidity(1, deadline),
        ])
        .txParams({
          variableOutputs: 2,
          ...getOverrides({
            gasLimit: txCost.total,
          }),
        })
        .call();

      return transactionResult;
    },
    {
      onSuccess: txFeedback(successMsg, handleSuccess),
      onError: handleError,
      onSettled: handleSettled,
    }
  );

  function handleSuccess() {
    fromInput.setAmount(null);
    toInput.setAmount(null);
    // Clean state before navigate to next
    // screen
    setTimeout(() => {
      navigate('../');
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleError(e: any) {
    const errors = e?.response?.errors;

    if (errors?.length) {
      if (errors[0].message === 'enough coins could not be found') {
        toast.error(
          `Not enough balance in your wallet to ${
            poolRatio ? 'add liquidity to' : 'create'
          } this pool.`
        );
      }
    } else {
      toast.error(`Error when trying to ${poolRatio ? 'add liquidity to' : 'create'} this pool.`);
    }
  }

  async function handleSettled() {
    onSettle?.();
  }

  const errorsCreatePull = useMemo(() => {
    const errors = [];

    if (!fromInput.amount) {
      errors.push(`Enter ${coinFrom.name} amount`);
    }
    if (!toInput.amount) {
      errors.push(`Enter ${coinTo.name} amount`);
    }
    if (!fromInput.hasEnoughBalance) {
      errors.push(`Insufficient ${coinFrom.name} balance`);
    }
    if (!toInput.hasEnoughBalance) {
      errors.push(`Insufficient ${coinTo.name} balance`);
    }

    return errors;
  }, [
    fromInput.amount,
    toInput.amount,
    fromInput.hasEnoughBalance,
    toInput.hasEnoughBalance,
    poolRatio,
  ]);

  return {
    mutation,
    errorsCreatePull,
    txCost,
  };
}
