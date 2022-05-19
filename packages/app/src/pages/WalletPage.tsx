import toast from "react-hot-toast";
import { useMutation } from "react-query";

import { AssetItem } from "~/components/AssetItem";
import { Button } from "~/components/Button";
import { Link } from "~/components/Link";
import { Spinner } from "~/components/Spinner";
import { WalletCard } from "~/components/WalletCard";
import { useAppContext, useWallet } from "~/context/AppContext";
import { useAssets } from "~/hooks/useAssets";
import { useFaucet } from "~/hooks/useFaucet";

const style = {
  sectionTitle: `flex items-center justify-between font-semibold text-xl mb-2`,
};

export default function WalletPage() {
  const wallet = useWallet();
  const { createWallet } = useAppContext();
  const { coins, isLoading, refetch } = useAssets();
  const faucet = useFaucet({
    onSuccess: () => {
      refetch();
    },
  });

  const createWalletMutation = useMutation(async () => createWallet(), {
    onSuccess: () => {
      toast.success("Wallet created successfully!");
    },
  });

  function handleCreateWallet() {
    createWalletMutation.mutate();
  }

  if (!wallet) {
    return (
      <WalletCard>
        <div className="flex flex-col justify-center text-gray-400 prose text-center">
          <h3 className="text-gray-300 mb-0">⚡️ Welcome SwaySwap</h3>
          <p>
            Seems you don&apos; have any wallet yet
            <br /> Click bellow to generate one
          </p>
          <div>
            <Button variant="primary" size="lg" onPress={handleCreateWallet}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </WalletCard>
    );
  }

  return (
    <WalletCard onFaucetAdded={refetch}>
      <div className={style.sectionTitle}>Assets</div>
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
        <div className="text-gray-500 pb-1">
          There&apos; no asset added yet.
          <br />
          <Link onPress={() => faucet.mutate()}>Click here</Link> to generate a
          new asset.
        </div>
      )}
    </WalletCard>
  );
}
