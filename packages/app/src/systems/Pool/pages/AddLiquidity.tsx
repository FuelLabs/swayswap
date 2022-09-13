import Decimal from "decimal.js";
import type { BN } from "fuels";
import { bn } from "fuels";
import { useAtom } from "jotai";
import { useEffect } from "react";

import {
  AddLiquidityPoolPrice,
  AddLiquidityPreview,
  PoolCurrentReserves,
} from "../components";
import { usePoolInfo, useAddLiquidity, useUserPositions } from "../hooks";
import { poolFromAmountAtom, poolToAmountAtom } from "../state";

import {
  CoinInput,
  useCoinInput,
  CoinSelector,
  NavigateBackButton,
  TOKENS,
  useBalances,
  CoinBalance,
  safeBigInt,
  toBigInt,
} from "~/systems/Core";
import { Button, Card } from "~/systems/UI";
import type { Maybe } from "~/types";

const style = {
  wrapper: `self-start max-w-[500px] mt-24`,
  content: `bg-gray-800 w-[30rem] rounded-xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  createPoolInfo: `font-mono mt-4 px-4 py-3 text-sm text-slate-400 decoration-1 border border-dashed
  border-white/10 rounded-xl w-full`,
};

export function AddLiquidity() {
  const [fromInitialAmount, setFromInitialAmount] = useAtom(poolFromAmountAtom);
  const [toInitialAmount, setToInitialAmount] = useAtom(poolToAmountAtom);
  const coinFrom = TOKENS[0];
  const coinTo = TOKENS[1];
  const balances = useBalances();
  const poolInfoQuery = usePoolInfo();
  const userPositions = useUserPositions();
  const { data: poolInfo, isLoading: isLoadingPoolInfo } = poolInfoQuery;
  const { poolRatio } = userPositions;

  const fromInput = useCoinInput({
    coin: coinFrom,
    disableWhenEth: true,
    onChange: handleChangeFromValue,
  });
  const toInput = useCoinInput({
    coin: coinTo,
    disableWhenEth: true,
    onChange: handleChangeToValue,
  });

  const {
    mutation: addLiquidityMutation,
    txCost,
    errorsCreatePull,
  } = useAddLiquidity({
    fromInput,
    toInput,
    coinFrom,
    coinTo,
    onSettle: async () => {
      await poolInfoQuery.refetch();
      await balances.refetch();
    },
  });

  function getButtonText() {
    if (isLoadingPoolInfo) {
      return "Loading...";
    }
    if (errorsCreatePull.length) {
      return errorsCreatePull[0];
    }
    return poolRatio ? "Add liquidity" : "Create liquidity";
  }

  function handleChangeFromValue(val: Maybe<BN>) {
    fromInput.setAmount(val);
    if (poolRatio) {
      const value = safeBigInt(val);
      const newToValue = bn(
        new Decimal(value.toHex()).div(poolRatio).ceil().toHex()
      );
      toInput.setAmount(toBigInt(newToValue));
    }
  }

  function handleChangeToValue(val: Maybe<BN>) {
    toInput.setAmount(val);

    if (poolRatio) {
      const value = safeBigInt(val);
      const newFromValue = bn(
        new Decimal(value.toHex()).div(poolRatio).ceil().toHex()
      );
      fromInput.setAmount(toBigInt(newFromValue));
    }
  }

  useEffect(() => {
    fromInput.setAmount(fromInitialAmount);
    toInput.setAmount(toInitialAmount);
  }, []);

  useEffect(() => {
    setFromInitialAmount(fromInput.amount);
    setToInitialAmount(toInput.amount);
  }, [fromInput.amount?.toHex(), toInput.amount?.toHex()]);

  const shouldDisableAddButton =
    !!errorsCreatePull.length ||
    addLiquidityMutation.isLoading ||
    txCost.isLoading ||
    !txCost.total;

  return (
    <Card className="max-w-[450px]">
      <Card.Title>
        <div className="flex items-center">
          <NavigateBackButton />
          Add Liquidity
        </div>
      </Card.Title>
      <div className="space-y-4 my-4">
        <CoinInput
          aria-label="Coin from input"
          autoFocus
          {...fromInput.getInputProps()}
          rightElement={<CoinSelector {...fromInput.getCoinSelectorProps()} />}
          bottomElement={<CoinBalance {...fromInput.getCoinBalanceProps()} />}
        />
        <CoinInput
          aria-label="Coin to input"
          id="coinTo"
          name="coinTo"
          {...toInput.getInputProps()}
          rightElement={
            <CoinSelector {...toInput.getCoinSelectorProps()} isReadOnly />
          }
          bottomElement={<CoinBalance {...toInput.getCoinBalanceProps()} />}
        />
      </div>
      <AddLiquidityPreview
        poolInfo={poolInfo}
        fromInput={fromInput}
        networkFee={txCost.fee}
      />
      <AddLiquidityPoolPrice coinFrom={coinFrom} coinTo={coinTo} />
      <Button
        aria-label="Add Liquidity Button"
        isDisabled={shouldDisableAddButton}
        isFull
        size="lg"
        variant="primary"
        isLoading={addLiquidityMutation.isLoading}
        onPress={
          errorsCreatePull.length
            ? undefined
            : () => {
                addLiquidityMutation.mutate();
              }
        }
      >
        {getButtonText()}
      </Button>
      {!poolRatio && !isLoadingPoolInfo ? (
        <div className={style.createPoolInfo} aria-label="create-pool">
          <h4 className="text-orange-400 mb-2 font-bold">
            You are creating a new pool
          </h4>
          <div className="flex">
            You are the first to provide liquidity to this pool. The ratio
            between these tokens will set the price of this pool.
          </div>
        </div>
      ) : null}
      {!!(poolInfo && poolRatio) && <PoolCurrentReserves />}
    </Card>
  );
}
