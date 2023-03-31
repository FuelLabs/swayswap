import { bn } from "fuels";
import { useMemo } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { PoolCurrentPosition, RemoveLiquidityPreview } from "../components";
import {
  PoolQueries,
  prepareRemoveLiquidity,
  submitRemoveLiquidity,
} from "../utils";

import { CONTRACT_ID } from "~/config";
import {
  CoinInput,
  CoinBalance,
  useCoinInput,
  CoinSelector,
  NavigateBackButton,
  useContract,
  ZERO,
  TOKENS,
  useBalances,
  useEthBalance,
} from "~/systems/Core";
import { useTransactionCost } from "~/systems/Core/hooks/useTransactionCost";
import { txFeedback } from "~/systems/Core/utils/feedback";
import { Button, Card } from "~/systems/UI";

export function RemoveLiquidityPage() {
  const navigate = useNavigate();
  const contract = useContract()!;
  const balances = useBalances();
  const ethBalance = useEthBalance();

  const liquidityToken = TOKENS.find((c) => c.assetId === CONTRACT_ID);
  const tokenInput = useCoinInput({
    coin: liquidityToken,
  });
  const amount = tokenInput.amount;

  const txCost = useTransactionCost(
    [PoolQueries.RemoveLiquidityNetworkFee, contract],
    () => prepareRemoveLiquidity(contract),
    {
      enabled: !!contract,
    }
  );

  const removeLiquidityMutation = useMutation(
    async () => {
      if (!amount) {
        throw new Error('"amount" is required');
      }
      // TODO: Add way to set min_eth and min_tokens
      // https://github.com/FuelLabs/swayswap/issues/55
      return submitRemoveLiquidity(contract, amount);
    },
    { onSuccess: txFeedback("Liquidity removed successfully!", handleSuccess) }
  );

  async function handleSuccess() {
    tokenInput.setAmount(ZERO);
    await balances.refetch();
    navigate("../");
  }

  if (!liquidityToken) {
    return null;
  }

  const errors = useMemo(() => {
    const errorList = [];

    if (!tokenInput.amount) {
      errorList.push(`Enter ${liquidityToken.name} amount`);
    }
    if (!tokenInput.hasEnoughBalance) {
      errorList.push(`Insufficient ${liquidityToken.name} balance`);
    }

    return errorList;
  }, [tokenInput.amount?.toString(), tokenInput.hasEnoughBalance]);

  const hasEnoughBalance = bn(ethBalance.raw).gt(txCost.fee);
  const isRemoveButtonDisabled =
    !!errors.length ||
    removeLiquidityMutation.isLoading ||
    !hasEnoughBalance ||
    !!txCost?.error;

  const getButtonText = () => {
    if (errors.length) {
      return errors[0];
    }

    if (!hasEnoughBalance) {
      return "Insufficient ETH for gas";
    }

    if (removeLiquidityMutation.isLoading) {
      return "Removing...";
    }

    return "Remove liquidity";
  };

  return (
    <Card>
      <Card.Title>
        <div className="flex items-center">
          <NavigateBackButton />
          Remove Liquidity
        </div>
      </Card.Title>
      <div className="mt-4 mb-4">
        <CoinInput
          aria-label="LP Token Input"
          autoFocus
          {...tokenInput.getInputProps()}
          rightElement={
            <CoinSelector {...tokenInput.getCoinSelectorProps()} isReadOnly />
          }
          bottomElement={<CoinBalance {...tokenInput.getCoinBalanceProps()} />}
        />
      </div>
      <RemoveLiquidityPreview networkFee={txCost.fee} amount={amount} />
      <Button
        isFull
        size="lg"
        variant="primary"
        onPress={() => removeLiquidityMutation.mutate()}
        isDisabled={isRemoveButtonDisabled}
      >
        {getButtonText()}
      </Button>
      <div className="mt-8">
        <h3 className="mb-1 mt-5 text-gray-100">Your current positions</h3>
      </div>
      <PoolCurrentPosition />
    </Card>
  );
}
