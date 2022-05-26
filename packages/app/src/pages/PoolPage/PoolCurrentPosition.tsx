import { PreviewTable, PreviewItem } from "~/components/PreviewTable";
import { TokenIcon } from "~/components/TokenIcon";
import { useCoinMetadata } from "~/hooks/useCoinMetadata";
import { useUserPositions } from "~/hooks/useUserPositions";

export const PoolCurrentPosition = () => {
  const info = useUserPositions();
  const { coinMetaData } = useCoinMetadata({ symbol: "ETH/DAI" });
  const coinFrom = coinMetaData?.pairOf?.[0];
  const coinTo = coinMetaData?.pairOf?.[1];

  return (
    <PreviewTable className="my-2">
      <PreviewItem
        title="Pooled DAI"
        value={
          <div className="inline-flex items-center gap">
            {info.formattedPooledDAI} <TokenIcon coinFrom={coinTo} size={14} />
          </div>
        }
      />
      <PreviewItem
        title="Pooled ETH"
        value={
          <div className="inline-flex items-center gap">
            {info.formattedPooledETH}{" "}
            <TokenIcon coinFrom={coinFrom} size={14} />
          </div>
        }
      />
      <PreviewItem title="Your pool tokens" value={info.formattedPoolTokens} />
      <PreviewItem
        title="Your pool share"
        value={`${info.formattedPoolShare}%`}
      />
    </PreviewTable>
  );
};
