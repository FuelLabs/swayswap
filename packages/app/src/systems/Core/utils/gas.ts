import { bn, ReceiptType } from 'fuels';
import type {
  BN,
  CallResult,
  FunctionInvocationScope,
  MultiCallInvocationScope,
  TxParams,
} from 'fuels';

import { multiply, ZERO } from './math';

import { GAS_PRICE } from '~/config';

export function getGasUsed(simulateResult: CallResult) {
  const scriptResult = simulateResult.receipts.find(
    (receipt) => receipt.type === ReceiptType.ScriptResult
  );
  if (scriptResult?.type === ReceiptType.ScriptResult) {
    return scriptResult.gasUsed;
  }
  return ZERO;
}

export type ChainConfig = {
  nodeInfo: {
    minGasPrice: string;
  };
  chain: {
    consensusParameters: {
      gasPriceFactor: string;
      maxGasPerTx: string;
    };
    latestBlock: {
      height: string;
    };
  };
};

export type TransactionCost = {
  total: BN;
  fee: BN;
  error?: string;
};

export function emptyTransactionCost(error?: string) {
  return {
    fee: ZERO,
    total: ZERO,
    error,
  };
}

export async function getTransactionCost(
  functionInvocation: FunctionInvocationScope | MultiCallInvocationScope
): Promise<TransactionCost> {
  try {
    const txCost = await functionInvocation
      .txParams({
        gasPrice: ZERO,
      })
      .getTransactionCost({
        fundTransaction: true,
      });
    return {
      total: multiply(txCost.gasUsed, 1.3),
      fee: txCost.fee,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log('in catch', err);
    return emptyTransactionCost(err?.message);
  }
}

export function getOverrides(overrides?: TxParams): TxParams {
  const gasLimit = bn(overrides?.gasLimit);
  const ret = {
    gasPrice: GAS_PRICE,
    gasLimit: !gasLimit.isZero() ? gasLimit : 100_000_000,
    ...overrides,
  };
  return ret;
}
