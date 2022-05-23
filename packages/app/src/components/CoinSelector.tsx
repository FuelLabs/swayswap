import cx from "classnames";
import { formatUnits } from "ethers/lib/utils";
import type { ReactNode } from "react";
import { useState, useEffect, forwardRef, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";

import { Button } from "./Button";
import { CoinsListDialog } from "./CoinsListDialog";
import { Dialog, useDialog } from "./Dialog";
import { Tooltip } from "./Tooltip";

import { DECIMAL_UNITS } from "~/config";
import { useBalances } from "~/hooks/useBalances";
import CoinsMetadata from "~/lib/CoinsMetadata";
import type { Coin } from "~/types";

const style = {
  root: `flex flex-1 flex-col items-end`,
  maxButton: `text-xs py-0 px-1 h-auto bg-primary-800/60 text-primary-500 hover:bg-primary-800`,
};

const formatValue = (amount: bigint | null | undefined) => {
  if (amount != null) {
    return formatUnits(amount, DECIMAL_UNITS);
  }
  // If amount is null return empty string
  return "";
};

export type CoinSelectorProps = {
  coin?: Coin | null;
  isReadOnly?: boolean;
  showBalance?: boolean;
  showMaxButton?: boolean;
  onChange?: (coin: Coin) => void;
  onSetMaxBalance?: () => void;
  tooltip?: ReactNode;
};

export const CoinSelector = forwardRef<HTMLDivElement, CoinSelectorProps>(
  (
    {
      coin,
      isReadOnly,
      showBalance = true,
      showMaxButton = true,
      onChange,
      onSetMaxBalance,
      tooltip: tooltipContent,
    },
    ref
  ) => {
    const [selected, setSelected] = useState<Coin | null>(null);
    const dialog = useDialog();
    const { data: balances } = useBalances({ enabled: showBalance });
    const coinBalance = balances?.find(
      (item) => item.assetId === coin?.assetId
    );

    const balance = useMemo(
      () => formatValue(coinBalance?.amount || BigInt(0)),
      [coinBalance?.assetId]
    );

    function handleSelect(assetId: string) {
      const next = CoinsMetadata.find((item) => item.assetId === assetId)!;
      dialog.close();
      setSelected(next);
      onChange?.(next);
    }

    const button = (
      <Button
        {...dialog.openButtonProps}
        size="md"
        isDisabled={isReadOnly}
        className={cx("coin-selector", {
          "coin-selector--empty": !selected,
        })}
      >
        {selected && selected.img && (
          <img
            className="rounded-full border-none ml-1"
            src={selected.img}
            alt={selected.name}
            height={20}
            width={20}
          />
        )}
        {selected ? (
          <div className="ml-2">{selected?.name}</div>
        ) : (
          <div className="ml-2">Select token</div>
        )}
        {!isReadOnly && <FiChevronDown className="text-current" />}
      </Button>
    );

    useEffect(() => {
      if (!coin) return setSelected(null);
      setSelected(coin);
    }, [coin]);

    return (
      <div className={style.root} ref={ref}>
        {tooltipContent ? (
          <Tooltip content={tooltipContent}>{button}</Tooltip>
        ) : (
          button
        )}
        <Dialog {...dialog.dialogProps}>
          <Dialog.Content>
            <CoinsListDialog onSelect={handleSelect} />
          </Dialog.Content>
        </Dialog>
        {(showBalance || showMaxButton) && (
          <div className="flex items-center gap-2 mt-2">
            {showBalance && (
              <div className="text-xs text-gray-400">Balance: {balance}</div>
            )}
            {showMaxButton && (
              <Button
                size="sm"
                onPress={onSetMaxBalance}
                className={style.maxButton}
                variant="ghost"
              >
                Max
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
