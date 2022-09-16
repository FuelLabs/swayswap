import { useSelector } from "@xstate/react";
import { useCallback } from "react";

import { useAddLiquidityContext } from "../hooks";
import type { AddLiquidityMachineState } from "../machines/addLiquidityMachine";

import { Button } from "~/systems/UI";

const buttonSelectors = {
  buttonText: (state: AddLiquidityMachineState) => {
    const ctx = state.context;

    if (state.hasTag("loading")) {
      return "Loading...";
    }
    if (state.hasTag("notHasFromBalance")) {
      return `Insufficient ${ctx.coinFrom.name || ""} balance`;
    }
    if (state.hasTag("notHasToBalance")) {
      return `Insufficient ${ctx.coinTo.name || ""} balance`;
    }
    if (state.hasTag("notHasEthForNetworkFee")) {
      return `Insufficient ETH for gas`;
    }
    if (state.hasTag("needEnterFromAmount")) {
      return `Enter ${ctx.coinFrom.name} amount`;
    }
    if (state.hasTag("needEnterToAmount")) {
      return `Enter ${ctx.coinTo.name} amount`;
    }
    if (state.hasTag("createPool")) {
      return "Create liquidity";
    }
    if (state.hasTag("addLiquidity")) {
      return "Add Liquidity";
    }
    return `Enter ${ctx.coinFrom.name} amount`;
  },
  notReadyToAddLiquidity: (state: AddLiquidityMachineState) => {
    return !state.hasTag("readyToAddLiquidity");
  },
  isLoading: (state: AddLiquidityMachineState) => {
    return state.hasTag("loading") || state.hasTag("isAddingLiquidity");
  },
};

export const AddLiquidityButton = () => {
  const { service, send } = useAddLiquidityContext();
  const isLoading = useSelector(service, buttonSelectors.isLoading);
  const buttonText = useSelector(service, buttonSelectors.buttonText);
  const notReadyToAddLiquidity = useSelector(
    service,
    buttonSelectors.notReadyToAddLiquidity
  );

  const handleAddLiquidity = useCallback(() => {
    send({
      type: "ADD_LIQUIDITY",
    });
  }, [send]);

  return (
    <Button
      aria-label="Add Liquidity Button"
      isFull
      size="lg"
      variant="primary"
      isLoading={isLoading}
      isDisabled={notReadyToAddLiquidity}
      onPress={handleAddLiquidity}
    >
      {buttonText}
    </Button>
  );
};
