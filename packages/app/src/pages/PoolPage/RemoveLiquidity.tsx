/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { formatUnits } from "ethers/lib/utils";
import { toBigInt } from "fuels";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";

import { Button } from "~/components/Button";
import { CoinInput, useCoinInput } from "~/components/CoinInput";
import { CoinSelector } from "~/components/CoinSelector";
import { Link } from "~/components/Link";
import { CONTRACT_ID, DECIMAL_UNITS } from "~/config";
import { useContract, useWallet } from "~/context/AppContext";
import { useBalances } from "~/hooks/useBalances";
import coins from "~/lib/CoinsMetadata";

export default function RemoveLiquidityPage() {
  const balances = useBalances();
  const contract = useContract()!;

  const liquidityToken = coins.find((c) => c.assetId === CONTRACT_ID);
  const tokenInput = useCoinInput({ coin: liquidityToken });
  const amount = tokenInput.amount;

  const removeLiquidityMutation = useMutation(
    async () => {
      if (!amount) {
        throw new Error('"amount" is required');
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
        tokenInput.setAmount(BigInt(0));
        balances.refetch();
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );

  if (!liquidityToken) {
    return null;
  }

  const validateRemoveLiquidity = () => {
    const errors = [];

    if (!tokenInput.amount) {
      errors.push(`Enter ${liquidityToken.name} amount`);
    }
    if (!tokenInput.hasEnoughBalance) {
      errors.push(`Insufficient ${liquidityToken.name} balance`);
    }

    return errors;
  };
  const errorsRemoveLiquidity = validateRemoveLiquidity();
  const isRemoveButtonDisabled = (
    !!errorsRemoveLiquidity.length ||
    removeLiquidityMutation.isLoading
  );

  return (
    <>
      <div className="mt-4 mb-4">
        <CoinInput
          {...tokenInput.getInputProps()}
          rightElement={<CoinSelector {...tokenInput.getCoinSelectorProps()} />}
          autoFocus
        />
      </div>
      <Button
        isFull
        size="lg"
        variant="primary"
        onPress={
          isRemoveButtonDisabled
            ? undefined
            : () => removeLiquidityMutation.mutate()
        }
        isDisabled={isRemoveButtonDisabled}
      >
        {errorsRemoveLiquidity.length
          ? errorsRemoveLiquidity[0]
          : removeLiquidityMutation.isLoading
          ? 'Removing...'
          : 'Remove liquidity'}
      </Button>
    </>
  );
}
