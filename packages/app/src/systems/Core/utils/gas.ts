import type { CallResult, ContractCall, Overrides, ScriptTransactionRequest } from 'fuels';
import { buildTransaction, arrayify, Provider, ReceiptType } from 'fuels';

import { divideFnValidOnly, toBigInt, toNumber, ZERO } from './math';

import { BYTE_PRICE, FUEL_PROVIDER_URL, GAS_PRICE } from '~/config';

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

export async function getChainConfig(): Promise<ChainConfig> {
  // TODO: replace this for a SDK provider query
  const chainConfigQuery = `query {
    nodeInfo {
      minGasPrice
      minBytePrice
    }
    chain {
      consensusParameters {
        gasPriceFactor
        maxGasPerTx
      }
      latestBlock {
        height
      }
    }
  }`;
  const chainConfigResponse = await fetch(FUEL_PROVIDER_URL, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      operationName: null,
      variables: {},
      query: chainConfigQuery,
    }),
  }).then<{ data: ChainConfig }>((resp) => resp.json());
  return chainConfigResponse.data;
}

export type TransactionCost = {
  gas: bigint;
  byte: bigint;
  total: bigint;
  fee: bigint;
  error?: string;
};

export function transactionByteSize(request: ScriptTransactionRequest) {
  const byteSize = request.toTransactionBytes().length;
  const witnessesByteSize = request.witnesses.reduce(
    (t, witnesses) => t + arrayify(witnesses).length,
    0
  );
  return toBigInt(byteSize - witnessesByteSize);
}

export function emptyTransactionCost(error?: string) {
  return {
    fee: ZERO,
    total: ZERO,
    gas: ZERO,
    byte: ZERO,
    error,
  };
}

function getPriceByFactor(total: bigint, chainConfig: ChainConfig) {
  return toBigInt(
    Math.ceil(divideFnValidOnly(total, chainConfig.chain.consensusParameters.gasPriceFactor))
  );
}

export function getTotalFee(gasUsed: bigint, byteSize: bigint, chainConfig?: ChainConfig) {
  if (!chainConfig) return ZERO;
  const gasFee = gasUsed * toBigInt(chainConfig.nodeInfo.minGasPrice);
  const byteFee = byteSize * toBigInt(chainConfig.nodeInfo.minBytePrice);
  return getPriceByFactor(gasFee, chainConfig) + getPriceByFactor(byteFee, chainConfig);
}

export async function getTransactionCost(
  contractCalls: ContractCall | ContractCall[]
): Promise<TransactionCost> {
  try {
    const calls = Array.isArray(contractCalls) ? contractCalls : [contractCalls];
    const chainConfig = await getChainConfig();
    const request = await buildTransaction(calls, {
      gasPrice: 0,
      bytePrice: 0,
      gasLimit: toBigInt(chainConfig.chain.consensusParameters.maxGasPerTx),
      fundTransaction: true,
    });
    const provider = new Provider(FUEL_PROVIDER_URL);
    const dryRunResult = await provider.call(request);
    const gasUsed = getGasUsed(dryRunResult);
    const byte = transactionByteSize(request);
    const gas = toBigInt(Math.ceil(toNumber(gasUsed) * 1.1));
    const total = gas + byte;

    return {
      gas,
      byte,
      total,
      fee: getTotalFee(gasUsed, byte, chainConfig),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return emptyTransactionCost(err?.message);
  }
}

export function getOverrides(overrides: Overrides) {
  const ret: Overrides = {
    gasPrice: GAS_PRICE,
    bytePrice: BYTE_PRICE,
    gasLimit: overrides.gasLimit || 10000000,
    transformRequest: async (request) => {
      request.gasLimit -= transactionByteSize(request);
      return request;
    },
    ...overrides,
  };
  return ret;
}
