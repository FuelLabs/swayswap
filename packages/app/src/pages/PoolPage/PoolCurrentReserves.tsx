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
    <PreviewTable title="Current pool reserves" className="my-2 mt-4">
      <PreviewItem
        title={
          <div className="inline-flex items-center gap">
            <TokenIcon coinFrom={coinFrom} size={14} />
            <div className="ml-2">
              {coinFrom?.name}: {formattedEthReserve}
            </div>
          </div>
        }
        value=""
      />
      <PreviewItem
        title={
          <div className="inline-flex items-center gap">
            <TokenIcon coinFrom={coinTo} size={14} />
            <div className="ml-2">
              {coinTo?.name}: {formattedTokenReserve}
            </div>
          </div>
        }
        value=""
      />
    </PreviewTable>
  );
};
