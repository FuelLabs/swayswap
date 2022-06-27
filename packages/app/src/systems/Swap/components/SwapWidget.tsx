import { useSwap } from "../hooks/useSwap";
import { useSwapCoinInput } from "../hooks/useSwapCoinInput";
import { useSwapCoinSelector } from "../hooks/useSwapCoinSelector";
import { useSwapMaxButton } from "../hooks/useSwapMaxButton";
import { FROM_TO, TO_FROM } from "../machines/swapMachine";

import { CoinBalance, CoinInput, CoinSelector } from "~/systems/Core";
import { InvertButton } from "~/systems/UI";

export function SwapWidget() {
  const { onInvertCoins, state } = useSwap();
  const coinSelectorFromProps = useSwapCoinSelector(FROM_TO);
  const coinSelectorToProps = useSwapCoinSelector(TO_FROM);
  const coinInputFromProps = useSwapCoinInput(FROM_TO);
  const coinInputToProps = useSwapCoinInput(TO_FROM);
  const coinFromMaxButtonProps = useSwapMaxButton(FROM_TO);
  const coinToMaxButtonProps = useSwapMaxButton(TO_FROM);

  return (
    <>
      <div className="mt-4">
        <CoinInput
          {...coinInputFromProps}
          aria-label="Coin from input"
          rightElement={
            <CoinSelector
              aria-label="Coin selector from"
              {...coinSelectorFromProps}
            />
          }
          bottomElement={<CoinBalance {...coinFromMaxButtonProps} />}
        />
      </div>
      <div className="flex items-center sm:justify-center -my-5">
        <InvertButton
          onClick={onInvertCoins}
          isDisabled={!state.canInvertCoins}
        />
      </div>
      <div className="mb-4">
        <CoinInput
          {...coinInputToProps}
          aria-label="Coin to input"
          rightElement={
            <CoinSelector
              aria-label="Coin selector to"
              {...coinSelectorToProps}
            />
          }
          bottomElement={<CoinBalance {...coinToMaxButtonProps} />}
        />
      </div>
    </>
  );
}
