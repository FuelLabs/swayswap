import { BiLinkExternal, BiWallet } from "react-icons/bi";
import { MdClose } from "react-icons/md";

import { useAssets, useWallet } from "../hooks";

import { AssetItem } from "./AssetItem";

import { BLOCK_EXPLORER_URL } from "~/config";
import { Button, Card, Link, Spinner } from "~/systems/UI";

type WalletInfoProps = {
  onClose: () => void;
};

export function WalletInfo({ onClose }: WalletInfoProps) {
  const { coins, isLoading } = useAssets();
  const wallet = useWallet();

  return (
    <Card className="min-w-[300px]">
      <Card.Title>
        <div className="flex items-center gap-2 mr-2">
          <BiWallet className="text-primary-500" />
          Wallet
        </div>
        <Button size="sm" className="dialog--closeBtn" onPress={onClose}>
          <MdClose />
        </Button>
      </Card.Title>
      {isLoading && (
        <div className="flex justify-start rounded-xl px-2 pt-2">
          <Spinner />
        </div>
      )}
      {coins.map((coin) => (
        <div className="mt-4" key={coin.assetId}>
          <AssetItem key={coin.assetId} coin={coin} />
        </div>
      ))}
      <div className="flex justify-center mt-4 text-sm">
        <Link
          isExternal
          className="flex items-center gap-2"
          href={`${BLOCK_EXPLORER_URL}/address/${wallet?.address}`}
        >
          View on Fuel Explorer <BiLinkExternal />
        </Link>
      </div>
    </Card>
  );
}
