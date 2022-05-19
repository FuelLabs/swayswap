/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { formatUnits } from "ethers/lib/utils";
import { toBigInt } from "fuels";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "~/components/Button";
import { CoinInput, useCoinInput } from "~/components/CoinInput";
import { Link } from "~/components/Link";
import { CONTRACT_ID, DECIMAL_UNITS } from "~/config";
import { useContract, useWallet } from "~/context/AppContext";
import coins from "~/lib/CoinsMetadata";
import { Pages } from "~/types/pages";

export default function RemoveLiquidityPage() {
  const wallet = useWallet()!;
  const contract = useContract()!;
  const navigate = useNavigate();

  const liquidityToken = coins.find((c) => c.assetId === CONTRACT_ID);
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
    <>
      <div className="mt-4 mb-4">
        <CoinInput
          {...tokenInput.getInputProps()}
          autoFocus
          coinSelectorDisabled={true}
        />
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
        {removeLiquidityMutation.isLoading ? "Removing..." : "Remove liquidity"}
      </Button>
    </>
  );
}
