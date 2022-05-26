import { BiWallet } from "react-icons/bi";

import { Card } from "./Card";

import { AssetItem } from "~/components/AssetItem";
import { Link } from "~/components/Link";
import { Spinner } from "~/components/Spinner";
import { useAssets } from "~/hooks/useAssets";
import { useFaucet } from "~/hooks/useFaucet";

export function WalletInfo() {
  const { coins, isLoading } = useAssets();
  const faucet = useFaucet();

  return (
    <Card>
      <Card.Title>
        <div className="flex items-center gap-2 mr-2">
          <BiWallet className="text-primary-500" />
          Wallet
        </div>
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
        <div className="text-gray-300 pb-1">
          There is no assets in your wallet.
          <br />
          <Link onPress={() => faucet.mutate()}>Click here</Link> to faucet test
          ether.
        </div>
      )}
    </Card>
  );
}
