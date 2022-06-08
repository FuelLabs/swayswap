import { useUserPositions } from "../hooks";

import {
  PreviewTable,
  PreviewItem,
  TokenIcon,
  useCoinMetadata,
  ETH_DAI,
} from "~/systems/Core";

export const PoolCurrentPosition = () => {
  const info = useUserPositions();
  const { coinMetaData } = useCoinMetadata({ symbol: ETH_DAI.name });
  const coinFrom = coinMetaData?.pairOf?.[0];
  const coinTo = coinMetaData?.pairOf?.[1];

  return (
    <PreviewTable className="my-2" aria-label="pool-current-position">
      <PreviewItem
        title="Pooled DAI"
        value={
          <div className="inline-flex items-center gap-1">
            {info.formattedPooledDAI} <TokenIcon coinFrom={coinTo} size={14} />
          </div>
        }
      />
      <PreviewItem
        title="Pooled ETH"
        value={
          <div className="inline-flex items-center gap-1">
            {info.formattedPooledETH}{" "}
            <TokenIcon coinFrom={coinFrom} size={14} />
          </div>
        }
      />
      <PreviewItem
        title="Your pool tokens"
        value={
          <div className="flex flex-1 items-center justify-end gap-1">
            {info.formattedPoolTokens}{" "}
            <TokenIcon coinFrom={coinFrom} coinTo={coinTo} size={14} />
          </div>
        }
      />
      <PreviewItem
        title="Your pool share"
        value={`${info.formattedPoolShare}%`}
      />
    </PreviewTable>
  );
};
