import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

import { Button } from "./Button";
import { CoinsListDialog } from "./CoinsListDialog";
import { Dialog, useDialogProps } from "./Dialog";

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

export function CoinSelector({ value, isReadOnly }: CoinSelectorProps) {
  const [selected, setSelected] = useState<Coin | null>(null);
  const dialog = useDialogProps();

  useEffect(() => {
    if (!value) return setSelected(null);
    setSelected(value);
  }, [value]);

  function handleSelect(assetId: string) {
    dialog.close();
    setSelected(CoinsMetadata.find((coin) => coin.assetId === assetId)!);
  }

  return (
    <div className={style.currencySelector}>
      <Button
        {...dialog.openButtonProps}
        size="md"
        className="coin-selector"
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
        <div className="ml-2">{selected?.name}</div>
        {!isReadOnly && <FiChevronDown className="text-gray-500" />}
      </Button>
      <Dialog {...dialog.dialogProps}>
        <Dialog.Content>
          <CoinsListDialog onSelect={handleSelect} />
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
