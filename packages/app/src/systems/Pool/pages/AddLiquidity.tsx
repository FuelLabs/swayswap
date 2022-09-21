import { useSelector } from "@xstate/react";
import type { BN } from "fuels";
import { bn } from "fuels";

import {
  AddLiquidityPoolPrice,
  AddLiquidityPreview,
  PoolCurrentReserves,
  AddLiquidityButton,
} from "../components";
import { useAddLiquidityContext } from "../hooks";
import { selectors } from "../selectors";
import { AddLiquidityActive } from "../types";

import {
  CoinInput,
  useCoinInput,
  CoinSelector,
  NavigateBackButton,
  CoinBalance,
  compareStates,
  MIN_GAS_AMOUNT_ADD_LIQUIDITY,
} from "~/systems/Core";
import { Card } from "~/systems/UI";
import type { Coin, Maybe } from "~/types";

export function AddLiquidity() {
  const { service, send } = useAddLiquidityContext();
  const coinFrom = useSelector(service, selectors.coinFrom);
  const coinTo = useSelector(service, selectors.coinTo);
  const fromAmount = useSelector(service, selectors.fromAmount, compareStates);
  const toAmount = useSelector(service, selectors.toAmount, compareStates);
  const isFromLoading = useSelector(
    service,
    selectors.isActiveLoading(AddLiquidityActive.from)
  );
  const isToLoading = useSelector(
    service,
    selectors.isActiveLoading(AddLiquidityActive.to)
  );
  const onChange =
    (coin: Maybe<Coin>, active: AddLiquidityActive) => (amount: Maybe<BN>) => {
      send({
        type: "INPUT_CHANGE",
        data: {
          amount,
          active,
          coin,
        },
      });
    };

  const fromInput = useCoinInput({
    coin: coinFrom,
    disableWhenEth: true,
    amount: fromAmount,
    gasFee: bn(MIN_GAS_AMOUNT_ADD_LIQUIDITY), // min gas for add liquidity
    onChange: onChange(coinFrom, AddLiquidityActive.from),
  });

  const toInput = useCoinInput({
    coin: coinTo,
    disableWhenEth: true,
    amount: toAmount,
    onChange: onChange(coinTo, AddLiquidityActive.to),
  });

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
          isLoading={isFromLoading}
          {...fromInput.getInputProps()}
          rightElement={<CoinSelector {...fromInput.getCoinSelectorProps()} />}
          bottomElement={<CoinBalance {...fromInput.getCoinBalanceProps()} />}
        />
        <CoinInput
          aria-label="Coin to input"
          id="coinTo"
          name="coinTo"
          isLoading={isToLoading}
          {...toInput.getInputProps()}
          rightElement={
            <CoinSelector {...toInput.getCoinSelectorProps()} isReadOnly />
          }
          bottomElement={<CoinBalance {...toInput.getCoinBalanceProps()} />}
        />
      </div>
      <AddLiquidityPreview />
      <AddLiquidityPoolPrice />
      <AddLiquidityButton />
      <PoolCurrentReserves />
    </Card>
  );
}
