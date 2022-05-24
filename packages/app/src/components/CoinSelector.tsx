import cx from "classnames";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

import { Button } from "./Button";
import { CoinsListDialog } from "./CoinsListDialog";
import { Dialog, useDialog } from "./Dialog";

import CoinsMetadata from "~/lib/CoinsMetadata";
import type { Coin } from "~/types";

const style = {
  currencySelector: `flex1`,
};

type CoinSelectorProps = {
  value?: Coin | null;
  isReadOnly?: boolean;
  onChange?: (coin: Coin) => void;
};

export function CoinSelector({
  value,
  isReadOnly,
  onChange,
}: CoinSelectorProps) {
  const [selected, setSelected] = useState<Coin | null>(null);
  const dialog = useDialog();

  useEffect(() => {
    if (!value) return setSelected(null);
    setSelected(value);
  }, [value]);

  function handleSelect(assetId: string) {
    const next = CoinsMetadata.find((coin) => coin.assetId === assetId)!;
    dialog.close();
    setSelected(next);
    onChange?.(next);
  }

  return (
    <div className={style.currencySelector}>
      <Button
        {...dialog.openButtonProps}
        size="md"
        className={cx("coin-selector", { "coin-selector--empty": !selected })}
        isDisabled={isReadOnly}
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
      <Dialog {...dialog.dialogProps}>
        <Dialog.Content>
          <CoinsListDialog onSelect={handleSelect} />
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
