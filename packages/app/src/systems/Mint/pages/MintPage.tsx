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
  const shouldDisableMint1 =
    mint.txCost.total.lte(0) || !!mint.txCost.error || mint.mintAmount1.lte(0);

  const shouldDisableMint2 =
    mint.txCost.total.lte(0) || !!mint.txCost.error || mint.mintAmount2.lte(0);

  const shouldDisableMint = shouldDisableMint1 || shouldDisableMint2;

  const getTextButton = () => {
    if (!mint.mintAmount1 || !mint.mintAmount2) return "Mint is closed!";
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
          You can mint UNI and DAI once per address only.
        </div>
        <div className="text-gray-300">
          <div className="text-sm mr-2 mt-2">UNI Amount:</div>
          <div className="font-bold text-gray-100 text-lg">
            {format(mint.mintAmount1)}
          </div>
          <div className="text-sm mr-2 mt-2">DAI Amount:</div>
          <div className="font-bold text-gray-100 text-lg">
            {format(mint.mintAmount2)}
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
