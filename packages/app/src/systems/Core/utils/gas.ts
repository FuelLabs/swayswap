import type { CallResult, Overrides } from 'fuels';
import { ReceiptType } from 'fuels';

import { toBigInt, toNumber } from './math';

export function getGasFee(simulateResult: CallResult) {
  const scriptResult = simulateResult.receipts.find(
    (receipt) => receipt.type === ReceiptType.ScriptResult
  );

  if (scriptResult?.type === ReceiptType.ScriptResult) {
    return toBigInt(Math.ceil(toNumber(scriptResult.gasUsed) * 1.15));
  }
  return toBigInt(1);
}

export function getOverrides(overrides: Overrides) {
  const ret: Overrides = {
    ...overrides,
    gasPrice: 1,
    bytePrice: 1,
  };
  return ret;
}
