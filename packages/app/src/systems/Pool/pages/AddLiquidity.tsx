import classNames from "classnames";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiCheckFill } from "react-icons/ri";

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
  ZERO,
  toBigInt,
  divideFnValidOnly,
  multiplyFn,
  TOKENS,
} from "~/systems/Core";
import { Button, Card, Spinner } from "~/systems/UI";
import type { Coin } from "~/types";

const style = {
  wrapper: `self-start max-w-[500px] mt-24`,
  content: `bg-gray-800 w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  createPoolInfo: `font-mono mt-4 px-4 py-3 text-sm text-slate-400 decoration-1 border border-dashed
  border-white/10 rounded-lg w-full`,
};

function PoolLoader({
  loading,
  step,
  steps,
}: {
  coinFrom: Coin;
  coinTo: Coin;
  loading: boolean;
  step: number;
  steps: string[];
}) {
  return (
    <ul className="w-full rounded-lg border border-gray-600 text-gray-900">
      {steps.map((stepText, index) => (
        <li
          key={index}
          className={classNames(
            "space-between flex w-full items-center border-b border-gray-600 px-6 py-2 text-white",
            {
              "rounded-t-lg": index === 0,
              "bg-primary-500": step === index && loading,
              "rounded-b-lg": index === steps.length,
            }
          )}
        >
          <div
            className="flex-1"
            aria-label={`Loading step: ${stepText}`}
            aria-disabled={step > index}
          >
            {stepText}
          </div>
          {step === index && loading && <Spinner />}
          {step > index && (
            <RiCheckFill
              aria-label={`Step completed: ${stepText}`}
              aria-hidden
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function AddLiquidity() {
  const [fromInitialAmount, setFromInitialAmount] = useAtom(poolFromAmountAtom);
  const [toInitialAmount, setToInitialAmount] = useAtom(poolToAmountAtom);
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    TOKENS[0],
    TOKENS[1],
  ]);

  const poolInfoQuery = usePoolInfo();
  const userPositions = useUserPositions();
  const { data: poolInfo, isLoading: isLoadingPoolInfo } = poolInfoQuery;
  const { poolRatio } = userPositions;

  const fromInput = useCoinInput({
    coin: coinFrom,
    disableWhenEth: true,
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    gasFee: toBigInt(1),
    onChange: handleChangeFromValue,
  });

  const toInput = useCoinInput({
    coin: coinTo,
    disableWhenEth: true,
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    onChange: handleChangeToValue,
  });

  // If reserve didn't return a ratio them the current user
  // Is creating the pool and the ratio is 1:1
  const addLiquidityRatio = divideFnValidOnly(fromInput.amount, toInput.amount);

  const {
    mutation: addLiquidityMutation,
    stage,
    errorsCreatePull,
  } = useAddLiquidity({
    fromInput,
    toInput,
    poolInfoQuery,
    coinFrom,
    coinTo,
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

  function handleChangeFromValue(val: bigint | null) {
    fromInput.setAmount(val);

    if (poolRatio) {
      const value = val || ZERO;
      const newToValue = Math.ceil(divideFnValidOnly(value, poolRatio));
      toInput.setAmount(BigInt(newToValue));
    }
  }

  function handleChangeToValue(val: bigint | null) {
    toInput.setAmount(val);

    if (poolRatio) {
      const value = val || ZERO;
      const newFromValue = Math.floor(multiplyFn(value, poolRatio));
      fromInput.setAmount(BigInt(newFromValue));
    }
  }

  useEffect(() => {
    fromInput.setAmount(fromInitialAmount);
    toInput.setAmount(toInitialAmount);
  }, []);

  useEffect(() => {
    setFromInitialAmount(fromInput.amount);
    setToInitialAmount(toInput.amount);
  }, [fromInput.amount, toInput.amount]);

  return (
    <Card className="max-w-[450px]">
      <Card.Title>
        <div className="flex items-center">
          <NavigateBackButton />
          Add Liquidity
        </div>
      </Card.Title>
      {addLiquidityMutation.isLoading ? (
        <div className="mt-6 mb-8 flex justify-center">
          <PoolLoader
            steps={[
              `Deposit: ${coinFrom.name}`,
              `Deposit: ${coinTo.name}`,
              `Provide liquidity`,
              `Done`,
            ]}
            step={stage}
            loading={addLiquidityMutation.isLoading}
            coinFrom={coinFrom}
            coinTo={coinTo}
          />
        </div>
      ) : (
        <>
          <div className="space-y-4 my-4">
            <CoinInput
              aria-label="Coin From Input"
              autoFocus
              {...fromInput.getInputProps()}
              rightElement={
                <CoinSelector {...fromInput.getCoinSelectorProps()} />
              }
            />
            <CoinInput
              aria-label="Coin To Input"
              id="coinTo"
              name="coinTo"
              {...toInput.getInputProps()}
              rightElement={
                <CoinSelector {...toInput.getCoinSelectorProps()} isReadOnly />
              }
            />
          </div>
          <AddLiquidityPreview poolInfo={poolInfo} fromInput={fromInput} />
          <AddLiquidityPoolPrice
            coinFrom={coinFrom}
            coinTo={coinTo}
            reservesFromToRatio={poolRatio || addLiquidityRatio || 1}
          />
          <Button
            aria-label="Add Liquidity Button"
            isDisabled={!!errorsCreatePull.length}
            isFull
            size="lg"
            variant="primary"
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
            <div className={style.createPoolInfo}>
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
        </>
      )}
    </Card>
  );
}
