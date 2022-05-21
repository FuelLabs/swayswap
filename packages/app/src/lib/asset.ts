import { toNumber } from "fuels"
import { ONE_ASSET } from "~/config"

export const calculateRatio = (fromAmount?: bigint | null, toAmount?: bigint | null) => {
  const _fromAmount = fromAmount || BigInt(0);
  const _toAmount = toAmount || BigInt(1);

  return (
    toNumber(ONE_ASSET * _fromAmount) /
    toNumber(_toAmount) /
    toNumber(ONE_ASSET)
  )
}