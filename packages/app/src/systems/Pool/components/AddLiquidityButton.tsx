import { useSelector } from "@xstate/react";
import { useCallback } from "react";

import { useAddLiquidityContext } from "../hooks";
import type { AddLiquidityMachineState } from "../machines/addLiquidityMachine";
import { selectors } from "../selectors";

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
    if (state.hasTag("needEnterAmount")) {
      return "Enter amount";
    }
    if (state.hasTag("createPool")) {
      return "Create Pool";
    }
    if (state.hasTag("addLiquidity")) {
      return "Add Liquidity";
    }

    return "Add Liquidity";
  },
  readyToAddLiquidity: (state: AddLiquidityMachineState) => {
    return !state.matches("readyToAddLiquidity");
  },
  isLoading: (state: AddLiquidityMachineState) => {
    return state.hasTag("loading") || state.hasTag("isAddingLiquidity");
  },
};

export const AddLiquidityButton = () => {
  const { service, send } = useAddLiquidityContext();
  const isLoading = useSelector(service, buttonSelectors.isLoading);
  const buttonText = useSelector(service, buttonSelectors.buttonText);
  const readyToAddLiquidity = useSelector(
    service,
    buttonSelectors.readyToAddLiquidity
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
      isDisabled={readyToAddLiquidity}
      onPress={handleAddLiquidity}
    >
      {buttonText}
    </Button>
  );
};
