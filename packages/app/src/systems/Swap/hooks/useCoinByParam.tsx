import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { TOKENS } from "~/systems/Core";

export function useCoinByParam(coinDir: string) {
  const [searchParams] = useSearchParams([["coinFrom", "ETH"]]);
  const param = searchParams.get(coinDir);

  return useMemo(() => {
    if (param) {
      return TOKENS.find((t) => t.assetId === param || t.symbol === param);
    }
  }, [param]);
}
