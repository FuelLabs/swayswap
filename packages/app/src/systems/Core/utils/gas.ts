import type { CallResult, Overrides, ScriptTransactionRequest } from 'fuels';
import { arrayify, Provider, ReceiptType } from 'fuels';

import { toBigInt, toNumber, ZERO } from './math';

import { FUEL_PROVIDER_URL } from '~/config';

const BYTE_PRICE = 1;
const GAS_PRICE = 1;

export function getGasFee(simulateResult: CallResult) {
  const scriptResult = simulateResult.receipts.find(
    (receipt) => receipt.type === ReceiptType.ScriptResult
  );
  if (scriptResult?.type === ReceiptType.ScriptResult) {
    return scriptResult.gasUsed;
  }
  return ZERO;
}

export type TransactionCost = {
  gas: bigint;
  byte: bigint;
  total: bigint;
  error?: string;
};

export function transactionByteSize(request: ScriptTransactionRequest) {
  const byteSize = toBigInt(request.toTransactionBytes().length * BYTE_PRICE);
  const witnessesByteSize = toBigInt(
    request.witnesses.reduce((t, witnesses) => t + arrayify(witnesses).length, 0)
  );

  return byteSize - witnessesByteSize;
}

export async function getTransactionCost(
  requestPromise: Promise<ScriptTransactionRequest>
): Promise<TransactionCost> {
  try {
    const request = await requestPromise;
    const provider = new Provider(FUEL_PROVIDER_URL);
    const dryRunResult = await provider.call(request);
    const gasFee = getGasFee(dryRunResult) * toBigInt(GAS_PRICE);
    const byte = transactionByteSize(request);
    const gas = toBigInt(Math.ceil(toNumber(gasFee) * 1.1));
    const total = gas + byte;

    return {
      total,
      gas,
      byte,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      total: ZERO,
      gas: ZERO,
      byte: ZERO,
      error: err?.message,
    };
  }
}

export function getOverrides(overrides: Overrides) {
  const ret: Overrides = {
    gasPrice: GAS_PRICE,
    bytePrice: BYTE_PRICE,
    transformRequest: async (request) => {
      request.gasLimit -= transactionByteSize(request);
      return request;
    },
    ...overrides,
  };
  return ret;
}
