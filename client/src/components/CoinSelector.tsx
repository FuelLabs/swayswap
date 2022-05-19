import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import CoinsMetadata from "src/lib/CoinsMetadata";
import { Coin } from "src/types";
import urlJoin from "url-join";

import { Button } from "./Button";
import { CoinsListModal } from "./CoinsListModal";
import { Dialog, useDialogProps } from "./Dialog";

const { PUBLIC_URL } = process.env;

const style = {
  currencySelector: `flex1`,
};

type CoinSelectorProps = {
  value?: Coin | null;
  onChange?: (coin: Coin) => void;
  isReadOnly?: boolean;
};

export function CoinSelector({
  value,
  onChange,
  isReadOnly,
}: CoinSelectorProps) {
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
            src={`/${urlJoin(PUBLIC_URL, selected.img)}`}
            alt={selected.name}
            height={20}
            width={20}
          />
        )}
        <div className="ml-2">{selected?.name}</div>
        <FiChevronDown className="text-gray-500" />
      </Button>
      <Dialog {...dialog.dialogProps}>
        <Dialog.Content>
          <CoinsListModal onSelect={handleSelect} />
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
