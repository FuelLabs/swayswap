import { formatUnits } from "ethers/lib/utils";
import { useContract, useWallet } from "src/context/AppContext";
import coins from "src/lib/CoinsMetadata";
import { CoinInput, useCoinInput } from "src/components/CoinInput";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { CONTRACT_ID, DECIMAL_UNITS } from "src/config";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { Button } from "src/components/Button";
import { Link } from "src/components/Link";
import { toBigInt } from "fuels";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
};

export default function RemoveLiquidityPage() {
  const liquidityToken = coins.find((c) => c.assetId === CONTRACT_ID);
  const wallet = useWallet()!;
  const contract = useContract()!;
  const navigate = useNavigate();

  const tokenInput = useCoinInput({ coin: liquidityToken });
  const amount = tokenInput.amount;

  const { data: balance } = useQuery(
    "RemoveLiquidityPage-balance",
    async () => {
      const balances = await wallet.getBalances();
      const result = balances.find((b) => b.assetId === CONTRACT_ID)!;
      return {
        amount: toBigInt(result?.amount || 0),
        formatted: result ? formatUnits(result?.amount, DECIMAL_UNITS) : "0",
      };
    }
  );

  const removeLiquidityMutation = useMutation(
    async () => {
      if (!amount) {
        throw new Error('"amount" is required');
      }
      if (amount > balance?.amount!) {
        throw new Error("Amount is bigger them the current balance!");
      }
      // TODO: Add way to set min_eth and min_tokens
      // https://github.com/FuelLabs/swayswap/issues/55
      await contract.functions.remove_liquidity(1, 1, 1000, {
        forward: [amount, CONTRACT_ID],
        variableOutputs: 2,
      });
    },
    {
      onSuccess: () => {
        toast.success("Liquidity removed successfully!");
        navigate(Pages.wallet);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );

  if (!liquidityToken) {
    return null;
  }

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Remove liquidity</h1>
        </div>
        <div className="mt-4 mb-4">
          <CoinInput {...tokenInput.getInputProps()} />
          <Link
            className="inline-flex mt-2 ml-2"
            onPress={() => tokenInput.setAmount(balance?.amount!)}
          >
            Max amount: {balance?.formatted! || "..."}
          </Link>
        </div>
        <Button
          isFull
          size="lg"
          variant="primary"
          onPress={() => removeLiquidityMutation.mutate()}
          isDisabled={
            !amount ||
            !balance ||
            amount > balance.amount ||
            removeLiquidityMutation.isLoading
          }
        >
          {removeLiquidityMutation.isLoading
            ? "Removing..."
            : "Remove liquidity"}
        </Button>
      </div>
    </div>
  );
}
