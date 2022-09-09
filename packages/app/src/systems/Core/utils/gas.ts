import type {
  BN,
  CallResult,
  FunctionInvocationScope,
  MultiCallInvocationScope,
  TxParams,
} from 'fuels';
import { bn, ReceiptType } from 'fuels';

import { toBigInt, ZERO } from './math';

import { BYTE_PRICE, GAS_PRICE } from '~/config';

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
    minBytePrice: string;
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
    fee: bn(0),
    total: bn(0),
    error,
  };
}

export async function getTransactionCost(
  functionInvocation: FunctionInvocationScope | MultiCallInvocationScope
): Promise<TransactionCost> {
  try {
    const txCost = await functionInvocation.getTransactionCost({
      gasPrice: GAS_PRICE || 0,
      fundTransaction: false,
    });
    return {
      total: toBigInt(txCost.gasUsed.toNumber() * 1.3),
      fee: txCost.fee,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return emptyTransactionCost(err?.message);
  }
}

export function getOverrides(overrides?: TxParams): TxParams {
  const ret = {
    gasPrice: GAS_PRICE,
    bytePrice: BYTE_PRICE,
    gasLimit: overrides?.gasLimit || 100_000_000,
    ...overrides,
  };
  return ret;
}
