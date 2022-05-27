import { PreviewTable, PreviewItem } from "~/components/PreviewTable";
import { TokenIcon } from "~/components/TokenIcon";
import { useCoinMetadata } from "~/hooks/useCoinMetadata";
import { useUserPositions } from "~/hooks/useUserPositions";
import { ETH_DAI } from "~/lib/CoinsMetadata";

export const PoolCurrentReserves = () => {
  const { formattedEthReserve, formattedTokenReserve } = useUserPositions();
  const { coinMetaData } = useCoinMetadata({ symbol: ETH_DAI.name });
  const coinFrom = coinMetaData?.pairOf?.[0];
  const coinTo = coinMetaData?.pairOf?.[1];

  return (
    <PreviewTable title="Current pool reserves" className="mt-4">
      <PreviewItem
        title={
          <div className="inline-flex items-center gap-2">
            <TokenIcon coinFrom={coinFrom} size={14} />
            {coinFrom?.name}
          </div>
        }
        value={formattedEthReserve}
      />
      <PreviewItem
        title={
          <div className="inline-flex items-center gap-2">
            <TokenIcon coinFrom={coinTo} size={14} />
            {coinTo?.name}
          </div>
        }
        value={formattedTokenReserve}
      />
    </PreviewTable>
  );
};
