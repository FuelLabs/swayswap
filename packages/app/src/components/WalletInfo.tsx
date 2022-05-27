import { useEffect, useRef } from "react";
import { BiWallet } from "react-icons/bi";
import { MdClose } from "react-icons/md";

import { Button } from "./Button";
import { Card } from "./Card";

import { AssetItem } from "~/components/AssetItem";
import { Spinner } from "~/components/Spinner";
import { useAssets } from "~/hooks/useAssets";

type WalletInfoProps = {
  onClose: () => void;
};

export function WalletInfo({ onClose }: WalletInfoProps) {
  const { coins, isLoading } = useAssets();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      buttonRef.current?.focus();
    }, 500);
  }, []);

  return (
    <Card className="min-w-[300px]">
      <Card.Title>
        <div className="flex items-center gap-2 mr-2">
          <BiWallet className="text-primary-500" />
          Wallet
        </div>
        <Button
          ref={buttonRef}
          size="sm"
          className="dialog--closeBtn"
          onPress={onClose}
        >
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
      {!isLoading && !coins.length && (
        <div className="flex items-center gap-3 text-gray-300 pt-2">
          <Spinner size={20} />
          We are adding 0.5 ETH for you.
        </div>
      )}
    </Card>
  );
}
