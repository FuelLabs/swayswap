import { useSwap } from "../hooks/useSwap";
import { useSwapCoinInput } from "../hooks/useSwapCoinInput";
import { useSwapCoinSelector } from "../hooks/useSwapCoinSelector";
import { FROM_TO, TO_FROM } from "../machines/swapMachine";

import { CoinInput, CoinSelector } from "~/systems/Core";
import { InvertButton } from "~/systems/UI";

export function SwapWidget() {
  const { onInvertCoins } = useSwap();
  const coinSelectorFromProps = useSwapCoinSelector(FROM_TO);
  const coinSelectorToProps = useSwapCoinSelector(TO_FROM);
  const coinInputFromProps = useSwapCoinInput(FROM_TO);
  const coinInputToProps = useSwapCoinInput(TO_FROM);

  return (
    <>
      <div className="mt-4">
        <CoinInput
          {...coinInputFromProps}
          rightElement={<CoinSelector {...coinSelectorFromProps} />}
        />
      </div>
      <div className="flex items-center sm:justify-center -my-5">
        <InvertButton onClick={onInvertCoins} />
      </div>
      <div className="mb-4">
        <CoinInput
          {...coinInputToProps}
          rightElement={<CoinSelector {...coinSelectorToProps} />}
        />
      </div>
    </>
  );
}
