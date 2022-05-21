import { useState } from "react";

import { Input } from "./Input";
import { Menu } from "./Menu";

import CoinsMetadata from "~/lib/CoinsMetadata";
import type { Coin } from "~/types";

const style = {
  input: `appearance-none w-full rounded-md bg-gray-700 px-4 py-2 focus-ring text-gray-100`,
  coinItem: `py-2 px-6 flex items-center gap-3 border-t border-gray-700
  hover:bg-gray-700/50 hover:cursor-pointer focus-ring`,
  noResults: `px-6 py-4 border-t border-gray-700`,
};

function filterByValid(coin: Coin) {
  // this is just for now until we have tokens coming from backend
  return coin.symbol === "DAI";
}

export type CoinListModalProps = {
  onSelect?: (assetId: string) => void;
};

export function CoinsListDialog({ onSelect }: CoinListModalProps) {
  const [value, setValue] = useState("");

  function filterBySearch(coin: Coin) {
    if (!value.length) return coin;
    return coin.name?.toLowerCase().includes(value.toLocaleLowerCase());
  }

  const filtered = CoinsMetadata.filter(filterByValid).filter(filterBySearch);
  const hasResults = Boolean(filtered.length);

  return (
    <div>
      <header className="py-4 px-6 pb-5">
        <h2 className="text-gray-50 text-lg mb-3">Select a token</h2>
        <Input
          type="text"
          placeholder="Search by name..."
          value={value}
          onChange={setValue}
        />
      </header>
      {hasResults ? (
        <Menu
          onAction={(key) => onSelect?.(key as string)}
          className="pb-2"
          focusOnMount
        >
          {filtered.map((coin) => (
            <Menu.Item key={coin.assetId} className={style.coinItem}>
              <img
                className="rounded-full border-none ml-1"
                src={coin.img}
                alt={coin.name}
                height={30}
                width={30}
              />
              <div className="flex flex-col">
                <div className="text-gray-50">{coin.symbol}</div>
                <div className="text-sm">{coin.name}</div>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      ) : (
        <div className={style.noResults}>😢 Oops, no token found!</div>
      )}
    </div>
  );
}
