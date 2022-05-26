import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiDollarCircle } from "react-icons/bi";
import { useMutation } from "react-query";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { CoinInput, useCoinInput } from "~/components/CoinInput";
import { CoinSelector } from "~/components/CoinSelector";
import { CONTRACT_ID, DEADLINE } from "~/config";
import { useContract } from "~/context/AppContext";
import { useBalances } from "~/hooks/useBalances";
import coins from "~/lib/CoinsMetadata";

export default function RemoveLiquidityPage() {
  const [errorsRemoveLiquidity, setErrorsRemoveLiquidity] = useState<string[]>(
    []
  );
  const balances = useBalances();
  const contract = useContract()!;

  const liquidityToken = coins.find((c) => c.assetId === CONTRACT_ID);
  const tokenInput = useCoinInput({
    coin: liquidityToken,
  });
  const amount = tokenInput.amount;

  const removeLiquidityMutation = useMutation(
    async () => {
      if (!amount) {
        throw new Error('"amount" is required');
      }
      // TODO: Add way to set min_eth and min_tokens
      // https://github.com/FuelLabs/swayswap/issues/55
      await contract.functions.remove_liquidity(1, 1, DEADLINE, {
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

  useEffect(() => {
    setErrorsRemoveLiquidity(validateRemoveLiquidity());
  }, [tokenInput.amount, tokenInput.hasEnoughBalance]);

  const isRemoveButtonDisabled =
    !!errorsRemoveLiquidity.length || removeLiquidityMutation.isLoading;

  const getButtonText = () => {
    if (errorsRemoveLiquidity.length) {
      return errorsRemoveLiquidity[0];
    }

    if (removeLiquidityMutation.isLoading) {
      return "Removing...";
    }

    return "Remove liquidity";
  };

  return (
    <Card>
      <Card.Title>
        <BiDollarCircle className="text-primary-500" />
        Remove Liquidity
      </Card.Title>
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
        {getButtonText()}
      </Button>
    </Card>
  );
}
