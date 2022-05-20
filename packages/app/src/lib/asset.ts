import { toNumber } from "fuels"
import { ONE_ASSET_UNIT } from "~/config"

export const calculateRatio = (fromAmount?: bigint | null, toAmount?: bigint | null) => {
  const _fromAmount = fromAmount || BigInt(0);
  const _toAmount = toAmount || BigInt(0);

  return (
    toNumber(ONE_ASSET_UNIT * _fromAmount) /
    toNumber(_toAmount) /
    toNumber(ONE_ASSET_UNIT)
  )
}