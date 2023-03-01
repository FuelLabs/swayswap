import { format } from "fuels";
import { BiCoin } from "react-icons/bi";
import { BsArrowDown } from "react-icons/bs";

import {
  MainLayout,
  NetworkFeePreviewItem,
  PreviewTable,
} from "~/systems/Core";
import { useMint } from "~/systems/Mint";
import { Button, Card } from "~/systems/UI";

export function MintPage() {
  const mint = useMint();
  const shouldDisableMint =
    mint.txCost.total.lte(0) || !!mint.txCost.error || mint.mintAmount.lte(0);

  const getTextButton = () => {
    if (!mint.mintAmount) return "Mint is closed!";
    if (!mint.txCost.total) return "Not enough ETH to pay gas fee";
    return "Mint tokens";
  };

  return (
    <MainLayout>
      <Card>
        <Card.Title>
          <BiCoin className="text-primary-500" />
          Mint
        </Card.Title>
        <div className="text-gray-300">
          You can mint some DAI once per address only.
        </div>
        <div className="text-gray-300">
          <div className="text-sm mr-2 mt-2">Amount:</div>
          <div className="font-bold text-gray-100 text-lg">
            {format(mint.mintAmount)}
          </div>
        </div>
        {!shouldDisableMint && (
          <>
            <div className="flex justify-center mt-2">
              <BsArrowDown size={20} className="text-gray-400" />
            </div>
            <PreviewTable className="mt-2 bg-transparent">
              <NetworkFeePreviewItem networkFee={mint.txCost.fee} />
            </PreviewTable>
          </>
        )}
        <Button
          size="md"
          variant="primary"
          isFull
          className="mt-4"
          isDisabled={shouldDisableMint}
          isLoading={mint.isLoading}
          onPress={() => mint.handleMint()}
        >
          {getTextButton()}
        </Button>
      </Card>
    </MainLayout>
  );
}
