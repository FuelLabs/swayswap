import { FaFaucet } from "react-icons/fa";
import { useWallet, useAppContext } from "src/context/AppContext";
import { CoinQuantity } from "fuels";
import { BigNumber } from "ethers";
import { Coin, CoinInput } from "src/components/CoinInput";
import CoinsMetadata from "src/lib/CoinsMetadata";
import { Spinner } from "src/components/Spinner";
import { useQuery, useMutation } from "react-query";
import { sleep } from "src/lib/utils";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl mb-8`,
  faucetButton: `hover:bg-[#41444F] cursor-pointer p-1 rounded-xl flex justify-center`,
};

type Asset = Coin & { amount: BigNumber };
const mergeCoinsWithMetadata = (coins: CoinQuantity[]): Array<Asset> => {
  return coins.map((coin) => {
    const coinMetadata = CoinsMetadata.find((c) => c.assetId === coin.assetId);

    return {
      // TODO: Create default Coin Metadata when token didn't have registered data
      // Another options could be querying from the contract
      // https://github.com/FuelLabs/swayswap-demo/issues/33
      name: coinMetadata?.name || "404",
      img: coinMetadata?.img || "/icons/other.svg",
      assetId: coin.assetId,
      amount: coin.amount || 0,
    };
  });
};

export default function WalletPage() {
  const { faucet } = useAppContext();
  const wallet = useWallet();

  const { data: balances, refetch: refetchBalances } = useQuery(
    "AssetsPage-balances",
    () => wallet!.getBalances()
  );

  const faucetMutation = useMutation(
    async () => {
      await faucet();
      await sleep(1000);
    },
    {
      onSuccess: () => refetchBalances(),
    }
  );

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Assets</div>
          <div className="flex w-10 justify-center rounded-xl p-1">
            {faucetMutation.isLoading ? (
              <div className="flex justify-center rounded-xl p-1">
                <Spinner />
              </div>
            ) : (
              <div
                className={style.faucetButton}
                onClick={() => faucetMutation.mutate()}
              >
                <FaFaucet />
              </div>
            )}
          </div>
        </div>
        {balances ? (
          <>
            {mergeCoinsWithMetadata(balances).map((coin) => {
              return (
                <div className="my-4" key={coin.assetId}>
                  <CoinInput
                    coin={coin}
                    disabled={true}
                    amount={coin.amount}
                    coins={coin ? [coin] : []}
                  />
                </div>
              );
            })}
          </>
        ) : null}
      </div>
    </div>
  );
}
