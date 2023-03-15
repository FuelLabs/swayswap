import { useSelector } from "@xstate/react";
import { bn, format } from "fuels";

import { useAddLiquidityContext } from "../hooks";
import { selectors } from "../selectors";

import { NewPoolWarning } from "./NewPoolWarning";

import {
  PreviewTable,
  PreviewItem,
  TokenIcon,
  compareStates,
} from "~/systems/Core";

export const PoolCurrentReserves = () => {
  const { service } = useAddLiquidityContext();
  const poolInfo = useSelector(service, selectors.poolInfo, compareStates);
  const coinFrom = useSelector(service, selectors.coinFrom);
  const createPool = useSelector(service, selectors.createPool);
  const coinTo = useSelector(service, selectors.coinTo);
  const isLoading = useSelector(service, selectors.isLoading);

  if (!poolInfo) return null;
  if (createPool) return <NewPoolWarning />;

  return (
    <PreviewTable
      title="Current pool reserves"
      className="mt-4"
      aria-label="pool-reserves"
    >
      <PreviewItem
        loading={isLoading}
        title={
          <div className="inline-flex items-center gap-2">
            <TokenIcon coinFrom={coinFrom} size={14} />
            {coinFrom?.name}
          </div>
        }
        value={format(bn(poolInfo?.token_reserve1))}
      />
      <PreviewItem
        loading={isLoading}
        title={
          <div className="inline-flex items-center gap-2">
            <TokenIcon coinFrom={coinTo} size={14} />
            {coinTo?.name}
          </div>
        }
        value={format(bn(poolInfo?.token_reserve2))}
      />
    </PreviewTable>
  );
};
